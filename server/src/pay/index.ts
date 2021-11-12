import { Subscription } from "../../../src/modules/subscription/Subscription";
import { PayRecipePayload } from "../../../src/modules/payRecipe/PayRecipePayload";
import {
  getOrderModel,
  getPayRecipeModel,
  getSubscriptionModel,
} from "../mongoClient";
import { Order } from "../../../src/modules/order/Order";

export const generateOrderAndUpdateSubscription = async (
  subscriptionId: string
): Promise<Order | null> => {
  const orderModel = getOrderModel();
  const subscriptionModel = getSubscriptionModel();
  const subscription = await subscriptionModel
    .findById(subscriptionId)
    .populate(["user", "product"]);
  if (!subscription) throw new Error("Subscription not founded");

  const existentOrder = await orderModel.findOne({
    subscriptionId,
    emittedDate: { $lte: subscription.dateOfNextPayOrder },
    cancelled: false,
  });
  if (existentOrder) return null;

  const discount = calculateDiscount(subscription);

  const order = await orderModel.create({
    userId: subscription.user.id,
    userName: `${subscription.user.lastname}, ${subscription.user.name}`,
    productId: subscription.product.id,
    productName: subscription.product.name,
    basePrice: subscription.product.price,
    totalDiscount: discount,
    amount: getFinalAmount(subscription.product.price, discount),
    emittedDate: new Date(),
    completed: false,
    cancelled: false,
    amountPayed: 0,
    subscriptionId: subscriptionId,
  });
  subscription.dateOfNextPayOrder.setMonth(
    subscription.dateOfNextPayOrder.getMonth() + 1
  );
  subscription.dateOfNextPayOrder.setDate(1);
  subscription.pendingPay = true;
  if (
    subscription.endTime &&
    subscription.endTime > subscription.dateOfNextPayOrder
  ) {
    subscription.save();
  }
  return order;
};

export const getOrders = async ({
  page,
  step,
  contentFilter,
  completed,
  cancelled,
}: {
  page: number;
  step: number;
  contentFilter?: string;
  completed?: Boolean;
  cancelled?: Boolean;
}) => {
  const orderModel = getOrderModel();
  let queries: any[] = [];
  let withQueries = false;
  if (contentFilter) {
    withQueries = true;
    const filters = contentFilter.split(",");
    filters.forEach((f) => {
      queries = [
        ...queries,
        { userName: { $regex: f, $options: "i" } },
        { productName: { $regex: f, $options: "i" } },
      ];
    });
  }
  if (completed !== undefined) {
    withQueries = true;
    queries = [...queries, { completed }];
  }

  if (cancelled !== undefined) {
    withQueries = true;
    queries = [...queries, { cancelled }];
  }
  return orderModel.find(withQueries ? { $and: queries } : {}, null, {
    skip: step * page,
    limit: step,
  });
};

export const getPayments = async ({
  page,
  step,
}: {
  page: number;
  step: number;
}) => {
  const payRecipeModel = getPayRecipeModel();
  return payRecipeModel.find({}, null, { skip: step * page, limit: step });
};

export const payOrder = async (orderId: string, amount: number) => {
  const orderModel = getOrderModel();
  const payRecipeModel = getPayRecipeModel();
  const order = await orderModel.findOne({
    _id: orderId,
    cancelled: false,
    completed: false,
  });
  if (!order) throw new Error("Valid order not found");
  const newPay: PayRecipePayload = {
    order,
    amount,
    emittedDate: new Date(),
  };

  const payment = await payRecipeModel.create(newPay);
  const amountPayed = order.amountPayed + amount;
  order.amountPayed = amountPayed;
  order.completed = amountPayed >= order.amount;
  await order.save();
  payment.order = order;
  await payment.save();
  return payment;
};

export const cancelOrder = async (orderId: string) => {
  const orderModel = getOrderModel();
  const order = await orderModel.findById(orderId);
  if (!order) throw Error("valid order not found");
  order.cancelled = true;
  await order.save();
  return order;
};

const calculateDiscount = (subscription: Subscription) => {
  let discount = 0;
  switch (subscription.user.familiars.length) {
    case 0:
      break;
    case 1:
      discount += subscription.product.twoSubscriptionsDiscount;
      break;
    case 2:
      discount += subscription.product.threeSubscriptionsDiscount;
      break;
    case 3:
      discount += subscription.product.fourSubscriptionsDiscount;
      break;
    case 4:
      discount += subscription.product.fiveOrMoreSubscriptionsDiscount;
      break;
    default:
      break;
  }
  return Math.max(subscription.specialDiscount, discount);
};

const getFinalAmount = (base: number, discount: number) => {
  return Math.max(base - (discount / 100) * base, 0);
};
