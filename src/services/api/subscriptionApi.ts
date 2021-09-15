import { getOptionsWithBody, url } from ".";
import { Subscription } from "../../modules/subscription/Subscription";
import { SubscriptionPayload } from "../../modules/subscription/SubscriptionPayload";

const mapToSubscription = (data: any): Subscription => {
    return {
        ...data,
        id: data._id,
        initialTime: new Date(data.initialTime),
        ... data.endTime ? {endTime: new Date(data.endTime)} : {}
    }  
}

export const createSubscription = (subscription: SubscriptionPayload) => {
    const options = getOptionsWithBody({ subscription }, "POST")
    return fetch(`${url}/subscription`, options)
        .then(response => response.json())
        .then(response => mapToSubscription(response.subscription))
}

export const fetchSubscriptions = ({ page, step, filterByContent = [] }
    : { page: number, step: number, filterByContent?: string[] }): Promise<Subscription[]> => {
    return fetch(`${url}/subscriptions?page=${page}&step=${step}${filterByContent.length > 0 ? `&contentFilter=${filterByContent.join(',')}` : ""}`)
        .then(response => response.json())
        .then(response => response.map(mapToSubscription))
}

export const deleteSubscription = ({subscriptionId}: {subscriptionId: string}) => {
    const options = getOptionsWithBody({ subscriptionId }, "DELETE")
    return fetch(`${url}/subscription`, options)
        .then(response => response.json())
}
