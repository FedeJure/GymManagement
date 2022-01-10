import { Document } from "mongodb";
import { Order } from "../../../src/modules/order/Order";
import { Subscription } from "../../../src/modules/subscription/Subscription";
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload";
import { getSubscriptionModel, getUserModel } from "../mongoClient";
import { generateOrderAndUpdateSubscription as generateOrder } from "../pay";
import { setPendingPayed } from "../user";
import { getNowDate } from "../utils/date";

export const getSubscriptions = async ({
  page,
  step,
  contentFilter,
}: {
  page: number;
  step: number;
  tagFilter?: string;
  contentFilter?: string;
}) => {
  const subscriptionModel = getSubscriptionModel();
  let queries: any[] = [];

  if (contentFilter) {
    const filters = contentFilter.split(",");
    filters.forEach((f) => {
      queries = [...queries, f.length === 24 ? { _id: f } : {}];
    });
  }
  const withQueries = contentFilter !== undefined;
  const subscriptions = await subscriptionModel
    .find(withQueries ? { $or: queries } : {}, null, {
      skip: step * page,
      limit: step,
    })
    .populate(["user", "product"]);
  return subscriptions;
};

export const saveSubscription = async (subscription: SubscriptionPayload) => {
  const subscriptionModel = getSubscriptionModel();
  const nextPayOrder = new Date(subscription.initialTime);
  const newSubscription = new subscriptionModel({
    ...subscription,
    dateOfNextPayOrder: nextPayOrder,
    user: subscription.userId,
    product: subscription.productId,
  });
  const createdSubscription = await subscriptionModel.create(newSubscription);
  await generateOrderAndUpdateSubscription(createdSubscription);

  return subscriptionModel
    .findById(createdSubscription._id)
    .populate(["user", "product"]);
};

export const removeSubscription = async (subscriptionId: string) => {
  const subscriptionModel = getSubscriptionModel();
  const removedSubscription = await subscriptionModel
    .findOneAndDelete({ _id: subscriptionId })
    .populate(["user", "product"]);
  return removedSubscription;
};

export const generateNewPayOrdersIfNeeded = async (): Promise<Order[]> => {
  const subscriptionModel = getSubscriptionModel();
  const now = getNowDate();
  const subscriptionWithPendingOrderCreation = await subscriptionModel.find({
    // initialTime: { $lt: now },
    dateOfNextPayOrder: { $lte: now },
  });
  const orders: Order[] = (
    await Promise.all(
      subscriptionWithPendingOrderCreation.map(async (s) => {
        const order = await generateOrderAndUpdateSubscription(s);
        if (!order) return order;
        const nextDate = s.dateOfNextPayOrder;
        nextDate.setMonth(s.dateOfNextPayOrder.getMonth() + 1);
        await subscriptionModel.updateOne(
          {
            _id: s._id,
          },
          {
            pendingPay: true,
            dateOfNextPayOrder: nextDate,
          }
        );
        return order;
      })
    )
  )
    .filter((o) => o !== null)
    .map((o) => o as Order);
  // await Promise.all(orders.map((order) => setPendingPayed(order.userId)));
  return orders;
};

const generateOrderAndUpdateSubscription = async (
  subscription: Document & Subscription
) => {
  if (getNowDate().getTime() < subscription.dateOfNextPayOrder.getTime())
    return null;
  const generatedOrder = await generateOrder(subscription.id);
  if (generatedOrder && !subscription.pendingPay && !generatedOrder.completed) {
    subscription.pendingPay = true;
    subscription.dateOfNextPayOrder.setMonth(
      subscription.dateOfNextPayOrder.getMonth() + 1
    );
    await subscription.save();
  }
  return generatedOrder;
};
