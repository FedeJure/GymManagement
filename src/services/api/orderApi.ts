import { getOptionsWithBody, url } from "."

const mapToOrder = (data: any) => {
    return {
        ...data,
        emittedDate: new Date(data.emittedDate)
    }
}

export const fetchOrders = ({ page, step, cancelled, completed, contentFilter }:
     { page: number, step: number, cancelled?: boolean, completed?: boolean, contentFilter?: string[] }) => {
    let urlWithQueries = `${url}/orders?page=${page}&step=${step}`
    urlWithQueries += cancelled != undefined ? `&cancelled=${cancelled}` : ""
    urlWithQueries += completed != undefined ? `&completed=${completed}` : ""
    urlWithQueries += contentFilter != undefined ? `&contentFilter=${contentFilter.join(',')}` : ""
    return fetch(urlWithQueries)
        .then(response => response.json())
        .then(response => response.map(mapToOrder))
}

export const createOrder = (subscriptionId: string) => {
    const options = getOptionsWithBody({ subscriptionId }, "POST")
    return fetch(`${url}/order`, options)
        .then(response => response.json())
        .then(response => mapToOrder(response.order))
}

export const cancelOrder = (orderId: string) => {
    const options = getOptionsWithBody({ orderId }, "DELETE")
    return fetch(`${url}/order`, options)
        .then(response => response.json())
}