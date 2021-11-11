import { Order } from "../../../src/modules/order/Order"
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload"
import { getSubscriptionModel } from "../mongoClient"
import { generateOrderAndUpdateSubscription } from "../pay"

export const getSubscriptions = async ({ page, step, contentFilter }
    : { page: number, step: number, tagFilter?: string, contentFilter?: string }) => {
    const subscriptionModel = getSubscriptionModel()
    let queries: any[] = []

    if (contentFilter) {
        const filters = contentFilter.split(',')
        filters.forEach(f => {
            queries = [...queries,
            f.length === 24 ? { _id: f } : {}]
        })
    }
    const withQueries = contentFilter !== undefined
    return subscriptionModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
        .populate(["user", "product"])
}

export const saveSubscription = async (subscription: SubscriptionPayload) => {
    const subscriptionModel = getSubscriptionModel()
    const nextPayOrder = new Date(subscription.initialTime)
    nextPayOrder.setMonth(nextPayOrder.getMonth() + 1)
    const newSubscription = new subscriptionModel({
        ...subscription,
        dateOfNextPayOrder: nextPayOrder,
        user: subscription.userId,
        product: subscription.productId
    })
    const saved = await subscriptionModel.create(newSubscription)
    generateOrderAndUpdateSubscription(saved.id)
    return subscriptionModel.findById(saved._id)
    .populate(["user", "product"])
}

export const removeSubscription = async (subscriptionId: string) => {
    const subscriptionModel = getSubscriptionModel()
    const removedSubscription = await subscriptionModel.findOneAndDelete({ _id: subscriptionId })
        .populate(["user", "product"])
    return removedSubscription
}

export const generateNewPayOrders = async (): Promise<Order[]> => {
    const subscriptionModel = getSubscriptionModel()
    const subscriptionWithPendingOrderCreation = await subscriptionModel.find({dateOfNextPayOrder : { $gte: new Date()}})

    return Promise.all(subscriptionWithPendingOrderCreation.map(s => generateOrderAndUpdateSubscription(s.id)))
}