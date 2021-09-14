import { StoreState } from "../../store"
import { UserSubscription } from "./UserSubscription"

export const getUserSubscriptions = (store: StoreState): UserSubscription[] => {
    return store.subscription.userSubscriptions
}