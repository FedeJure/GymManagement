import { Dispatch } from "redux";
import { createSubscription } from "../../services/api";
import { SubscriptionPayload } from "./SubscriptionPayload";

export const createSubscriptionAction = (subscription: SubscriptionPayload) => {
    return (dispatch: Dispatch) => {
        createSubscription(subscription)
            .then(subscription => {
                dispatch({
                    type: "CREATE_SUBSCRIPTION",
                    subscription
                })
            })
    }  
}