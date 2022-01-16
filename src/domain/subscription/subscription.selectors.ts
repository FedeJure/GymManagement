import { StoreState } from "../../store"
import { Subscription } from "./Subscription"

export const getsubscriptions = (store: StoreState): Subscription[] => {
    return store.subscription.subscriptions
}