import { Document } from "mongodb";
import { Order } from "../../../src/modules/order/Order";
import { Subscription } from "../../../src/modules/subscription/Subscription";
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload";
import { getSubscriptionModel, getOrderModel } from "../mongoClient";
import { generateOrderAndUpdateSubscription as generateOrder } from "../pay";
import { setPendingPayed } from "../user";

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
  const orderModel = getOrderModel();
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
  generateOrderAndUpdateSubscription(createdSubscription);

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
  const now = new Date();
  const subscriptionWithPendingOrderCreation = await subscriptionModel.find({
    initialTime: { $lte: now },
    dateOfNextPayOrder: { $gte: now },
  });

  const orders: Order[] = (
    await Promise.all(
      subscriptionWithPendingOrderCreation.map((s) =>
        generateOrderAndUpdateSubscription(s)
      )
    )
  )
    .filter((o) => o !== null)
    .map((o) => o as Order);
  orders.forEach((order) => setPendingPayed(order.userId));
  return orders;
};

const generateOrderAndUpdateSubscription = async (
  subscription: Document & Subscription
) => {
  if (Date.now() < subscription.dateOfNextPayOrder.getTime()) return null;
  const generatedOrder = await generateOrder(subscription.id);
  if (generatedOrder && !subscription.pendingPay && !generatedOrder.completed) {
    subscription.pendingPay = true;
    subscription.dateOfNextPayOrder.setMonth(
      subscription.dateOfNextPayOrder.getMonth() + 1
    );
    subscription.save();
  }
  return generatedOrder;
};
