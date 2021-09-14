import Subscriptions from "../../screens/subscriptions/Subscriptions"
import { SubscriptionState } from "./SubscriptionState"

const initialState : SubscriptionState = {
    subscriptions: []
}

export const subscription = (state: SubscriptionState, action: any): SubscriptionState => {
    if (!state) return initialState
    switch (action.type) {
        case "CREATE_SUBSCRIPTION":
            return {
                ...state,
                subscriptions: [...state.subscriptions, action.subscription]
            }
        case "FETCH_SUBSCRIPTIONS":
            return {
                ...state,
                subscriptions: action.subscriptions
            }
        case "APPEND_SUBSCRIPTIONS" :
            return {
                ...state,
                subscriptions: [...state.subscriptions, ...action.subscriptions]
            }
        default:
            return state
    }
}