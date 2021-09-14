import { SubscriptionState } from "./SubscriptionState"

const initialState : SubscriptionState = {
    userSubscriptions: []
}

export const subscription = (state: SubscriptionState, action: any): SubscriptionState => {
    if (!state) return initialState
    switch (action.type) {
        case "CREATE_SUBSCRIPTION":
            return {
                ...state,
                userSubscriptions: [...state.userSubscriptions, action.userSubscription]
            }
        case "FETCH_SUBSCRIPTIONS":
            return {
                ...state,
                userSubscriptions: action.userSubscriptions
            }
        default:
            return state
    }
}