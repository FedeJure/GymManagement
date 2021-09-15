import { Subject } from "rxjs"
import { Subscription } from "../../../src/modules/subscription/Subscription"
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload"
import { getSubscriptionModel } from "../mongoClient"


const onNewSubscription = new Subject<Subscription>()
const onDeleteSubscription = new Subject<Subscription>()

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
        .then((subscription: Subscription) => {
            onNewSubscription.next(subscription)
            return subscription
        })
}

export const removeSubscription = async (subscriptionId: string) => {
    const subscriptionModel = getSubscriptionModel()
    return subscriptionModel.findOneAndDelete({ _id: subscriptionId })
        .populate(["user", "product"]).then(
            (subscription: Subscription) => {
                onDeleteSubscription.next(subscription)
            }
        )
}

export const startListenSubscriptions = () => {

}