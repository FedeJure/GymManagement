import { Subscription } from "../../../src/domain/subscription/Subscription";
import { PayRecipePayload } from "../../../src/domain/payRecipe/PayRecipePayload";
import {
  getOrderModel,
  getPayRecipeModel,
  getSubscriptionModel,
  getUserModel,
} from "../mongoClient";
import { Order } from "../../../src/domain/order/Order";
import { OrderStateEnum } from "../../../src/domain/order/OrderStateEnum";
import { getNowDate } from "../utils/date";

export const tryGenerateOrder = async (
  subscriptionId: string
): Promise<Order | null> => {
  const orderModel = getOrderModel();
  const subscriptionModel = getSubscriptionModel();
  const subscription = await subscriptionModel
    .findById(subscriptionId)
    .populate(["user", "product"]);
  if (!subscription) throw new Error("Subscription not founded");

  const now = getNowDate();
  if (now.getTime() < subscription.initialTime.getTime()) return null;
  const period = new Date(
    subscription.dateOfNextPayOrder.getFullYear(),
    subscription.dateOfNextPayOrder.getMonth()
  );
  const existentOrder = await orderModel.findOne({
    subscriptionId: subscriptionId,
    periodPayed: period,
    cancelled: false,
  });
  if (existentOrder) return null;

  const discount = await calculateDiscount(subscription);

  const order = await orderModel.create({
    userId: subscription.user.id,
    userName: `${subscription.user.lastname}, ${subscription.user.name}`,
    productId: subscription.product.id,
    productName: subscription.product.name,
    basePrice: subscription.product.price,
    totalDiscount: discount,
    amount: getFinalAmount(subscription.product.price, discount),
    emittedDate: now,
    periodPayed: period,
    completed: false,
    cancelled: false,
    amountPayed: 0,
    subscriptionId: subscriptionId,
  });

  return order;
};

export const getOrders = async ({
  page,
  step,
  contentFilter = "",
  tagFilter = "",
}: {
  page: number;
  step: number;
  contentFilter?: string;
  tagFilter?: string;
}) => {
  const orderModel = getOrderModel();
  let queries: any[] = [];
  if (contentFilter) {
    const filters = contentFilter.split(",");
    filters.forEach((f) => {
      queries = [
        ...queries,
        { userName: { $regex: f, $options: "i" } },
        { productName: { $regex: f, $options: "i" } },
      ];
    });
  }
  const tagFilters = tagFilter.split(",");

  queries = (tagFilter.length > 0) ? [...queries, {state: {$in: tagFilters}}] : queries
  const orders = await orderModel
    .find(queries.length > 0 ? { $or: queries } : {}, null, {
      skip: step * page,
      limit: step,
    })
    .then((documents) => {
      return documents.map((d) => {
        d.id = d._id;
        return d;
      });
    });
  return orders;
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
  const userModel = getUserModel();
  const subscriptionModel = getSubscriptionModel();
  const order = await orderModel.findOne({
    _id: orderId,
    state: OrderStateEnum.AVAILABLE
  });
  if (!order) throw new Error("Valid order not found");
  if (order.amountPayed + amount > order.amount) throw new Error("Amount exceed debt");

  const newPay: PayRecipePayload = {
    order,
    amount,
    emittedDate: getNowDate(),
  };

  const payment = await payRecipeModel.create(newPay);
  const amountPayed = order.amountPayed + amount;

  order.amountPayed = amountPayed;
  order.state = amountPayed >= order.amount ? OrderStateEnum.COMPLETE : order.state;
  await order.save();
  payment.order = order;
  await payment.save();

  if (order.state === OrderStateEnum.COMPLETE) {
    await subscriptionModel.updateOne(
      {
        _id: order.subscriptionId,
      },
      {
        pendingPay: false,
      }
    );
    const haveAnotherOrdersOpen = await orderModel.exists({
      userId: order.userId,
      completed: false,
      cancelled: false,
    });
    if (!haveAnotherOrdersOpen) {
      await userModel.updateOne(
        {
          _id: order.userId,
        },
        {
          pendingPay: false,
        }
      );
    }
  }
  return payment;
};

export const cancelOrder = async (orderId: string) => {
  const orderModel = getOrderModel();
  const order = await orderModel.findById(orderId);
  if (!order) throw Error("valid order not found");
  order.state = OrderStateEnum.CANCELLED
  await order.save();
  return order;
};

const calculateDiscount = async (subscription: Subscription) => {
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

export const getConfig = async () => {
  const orderModel = getOrderModel()
  const size = await orderModel.count()
  return {
    totalCount: size
  }
}