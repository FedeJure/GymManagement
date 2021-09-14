import { Dispatch } from "redux";
import { createSubscription, fetchSubscriptions } from "../../services/api";
import { SubscriptionPayload } from "./SubscriptionPayload";

export const createSubscriptionAction = (subscription: SubscriptionPayload) => {
    return (dispatch: Dispatch) => {
        createSubscription(subscription)
            .then(subscription => dispatch({
                type: "CREATE_SUBSCRIPTION",
                subscription
            })
            )
    }
}

export const fetchSubscriptionsAction = ({ page, filterByContent }: { page: number, filterByContent: string[] }) => {
    return (dispatch: Dispatch) => {
        fetchSubscriptions({ page, step: 20, filterByContent })
            .then(subscriptions => dispatch({
                type: "FETCH_SUBSCRIPTIONS",
                subscriptions
            }))
    }
}