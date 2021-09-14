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
            { user: { $regex: f, "$options": "i" } },
            { product: { $regex: f, "$options": "i" } },
            f.length == 24 ? { _id: f } : {}]
        })
    }
    const withQueries = contentFilter != undefined
    return subscriptionModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
        .populate("user").populate("product")
}

export const saveSubscription = async (subscription: SubscriptionPayload) => {
    const subscriptionModel = getSubscriptionModel()
    const newSubscription = new subscriptionModel({ ...subscription })
    return subscriptionModel.create(newSubscription)
        .then(saved => subscriptionModel.findById(saved._id)
            .populate("user").populate("product"))
}