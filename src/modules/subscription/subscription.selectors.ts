import { StoreState } from "../../store"
import { ProductPayload } from "../product/ProductPayload"
import { UserPayload } from "../users/UserPayload"
import { UserSubscription } from "./UserSubscription"

export const getUserSubscriptions = (store: StoreState): UserSubscription[] => {
    const usersMap: { [key: string]: UserPayload } = {}
    store.user.users.forEach(u => usersMap[u.id] = u)
    const productMap: { [key: string]: ProductPayload } = {}
    store.product.products.forEach(p => productMap[p.id] = p)
    return store.subscription.subscriptions
    .filter(s => usersMap[s.userId] && productMap[s.productId])
        .map(s => ({
            user: usersMap[s.userId],
            subscription: s,
            product: productMap[s.productId]
        }))
}