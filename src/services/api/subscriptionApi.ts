import { getOptionsWithBody, url } from ".";
import { SubscriptionPayload } from "../../modules/subscription/SubscriptionPayload";
import { Subscription } from "../../modules/subscription/Subscription";

const mapToSubscription = (data: any): Subscription => {
    return {
        ...data,
        id: data._id
    }
}

export const createSubscription = (subscription: SubscriptionPayload) => {
    const options = getOptionsWithBody({ subscription }, "POST")
    return fetch(`${url}/subscription`, options)
        .then(response => response.json())
        .then(response => mapToSubscription(response.product))
}