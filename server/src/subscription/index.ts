import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload"
import { getSubscriptionModel } from "../mongoClient"

export const getSubscriptions = async ({ page, step, contentFilter }
    : { page: number, step: number, tagFilter?: string, contentFilter?: string }) => {
    const subscriptionModel = getSubscriptionModel()
    let queries: any[] = []

    if (contentFilter) {
        const filters = contentFilter.split(',')
        filters.forEach(f => {
            queries = [...queries,
            f.length == 24 ? { _id: f } : {}]
        })
    }
    const withQueries = contentFilter != undefined
    return subscriptionModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
        .populate(["user", "product"])
}

export const saveSubscription = async (subscription: SubscriptionPayload) => {
    const subscriptionModel = getSubscriptionModel()
    const newSubscription = new subscriptionModel({
        ...subscription,
        user: subscription.userId,
        product: subscription.productId
    })
    return subscriptionModel.create(newSubscription)
        .then(saved => subscriptionModel.findById(saved._id)
            .populate(["user", "product"]))
}