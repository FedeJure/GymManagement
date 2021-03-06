import { Document } from "mongodb";
import { Order } from "../../../src/domain/order/Order";
import { OrderStateEnum } from "../../../src/domain/order/OrderStateEnum";
import { Subscription } from "../../../src/domain/subscription/Subscription";
import { SubscriptionPayload } from "../../../src/domain/subscription/SubscriptionPayload";
import { getSubscriptionModel } from "../mongoClient";
import { tryGenerateOrder } from "../pay";
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
  const subscriptionInitalDate = new Date(subscription.initialTime)
  const nextPayOrder = new Date(subscriptionInitalDate.getFullYear(), subscriptionInitalDate.getMonth());
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
      subscriptionWithPendingOrderCreation.map(async (s) =>
        generateOrderAndUpdateSubscription(s)
      )
    )
  )
    .filter((o) => o !== null)
    .map((o) => o as Order);
  return orders;
};

const generateOrderAndUpdateSubscription = async (
  subscription: Document & Subscription
) => {
  const subscriptionModel = getSubscriptionModel();
  const generatedOrder = await tryGenerateOrder(subscription.id);
  if (generatedOrder && !(generatedOrder.state === OrderStateEnum.COMPLETE)) {

    await subscriptionModel.updateOne(
      { _id: subscription.id },
      {
        pendingPay: true,
        dateOfNextPayOrder: new Date(
          subscription.dateOfNextPayOrder.getFullYear(),
          subscription.dateOfNextPayOrder.getMonth() + 1
        ),
      }
    );

    await subscription.save();
  }
  return generatedOrder;
};

export const getConfig = async () => {
  const subscriptionsModel = getSubscriptionModel()
  const size = await subscriptionsModel.count()
  return {
    totalCount: size
  }
}