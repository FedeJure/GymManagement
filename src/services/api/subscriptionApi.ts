import { getOptionsWithBody, url } from ".";
import { SubscriptionPayload } from "../../modules/subscription/SubscriptionPayload";
import { UserSubscription } from "../../modules/subscription/UserSubscription";

const mapToUserSubscription = (data: any): UserSubscription => {
    console.log(data)
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
        .then(response => mapToUserSubscription(response.subscription))
}

export const fetchSubscriptions = ({ page, step, filterByContent = [] }
    : { page: number, step: number, filterByContent?: string[] }): Promise<UserSubscription[]> => {
    return fetch(`${url}/subscriptions?page=${page}&step=${step}${filterByContent.length > 0 ? `&contentFilter=${filterByContent.join(',')}` : ""}`)
        .then(response => response.json())
        .then(response => response.map(mapToUserSubscription))
}
