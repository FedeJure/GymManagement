import { getOptionsWithBody, url } from "."

const mapToOrder = (data: any) => {
    return {
        ...data,
        emittedDate: new Date(data.emittedDate)
    }
}

export const fetchOrders = ({ page, step }: { page: number, step: number }) => {
    return fetch(`${url}/orders?page=${page}&step=${step}`)
        .then(response => response.json())
        .then(response => response.map(mapToOrder))
}

export const createOrder = (subscriptionId: string) => {
    const options = getOptionsWithBody({ subscriptionId }, "POST")
    return fetch(`${url}/order`, options)
        .then(response => response.json())
        .then(response => mapToOrder(response.order))
}