import { SubscriptionState } from "./SubscriptionState"

const initialState : SubscriptionState = {
    subscriptions: []
}

export const subscription = (state: SubscriptionState, action: any): SubscriptionState => {
    if (!state) return initialState
    switch (action.type) {
        case "CREATE_SUBSCRIPTION":
            return state
        default:
            return state
    }
}