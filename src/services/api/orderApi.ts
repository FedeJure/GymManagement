import { url } from "."

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