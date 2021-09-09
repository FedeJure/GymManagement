import { StoreState } from "../../store"
import { ProductPayload } from "../product/ProductPayload"
import { UserPayload } from "../users/UserPayload"
import { UserSubscription } from "./UserSubscription"

export const getUserSubscriptions = (store: StoreState): UserSubscription[] => {
    const usersMap: { [key: number]: UserPayload } = {}
    store.user.users.forEach(u => usersMap[u.id] = u.data)
    const productMap: { [key: number]: ProductPayload } = {}
    store.product.products.forEach(p => productMap[p.id] = p.data)
    return store.subscription.subscriptions
    .filter(s => usersMap[s.data.userId] && productMap[s.data.productId])
        .map(s => ({
            user: usersMap[s.data.userId],
            subscription: s,
            product: productMap[s.data.productId]
        }))
}