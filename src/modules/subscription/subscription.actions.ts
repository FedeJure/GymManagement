import { Dispatch } from "redux";
import { createSubscription, fetchSubscriptions } from "../../services/api";
import { SubscriptionPayload } from "./SubscriptionPayload";

export const createSubscriptionAction = (subscription: SubscriptionPayload) => {
    return (dispatch: Dispatch) => {
        createSubscription(subscription)
            .then(subscription => dispatch({
                type: "CREATE_SUBSCRIPTION",
                subscription
            }))
            .catch(error => console.error(error))
        }
}

export const fetchSubscriptionsAction = ({ page, filterByContent, append = false }
    : { page: number, filterByContent: string[], append?: boolean }) => {
    return (dispatch: Dispatch) => {
        fetchSubscriptions({ page, step: 20, filterByContent })
            .then(subscriptions => dispatch({
                type: append ? "APPEND_SUBSCRIPTIONS" : "FETCH_SUBSCRIPTIONS",
                subscriptions
            }))
            .catch(error => console.error(error))

    }
}