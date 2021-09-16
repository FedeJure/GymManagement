import { Dispatch } from "redux"
import { createOrder, fetchOrders } from "../../services/api/orderApi"

export const getOrdersAction = ({ page, step = 20, filterByContent, append }: { page: number, step?: number, filterByContent?: string[], append: boolean }) => {
    return (dispatch: Dispatch) => {
        fetchOrders({ page, step })
            .then(orders => dispatch({
                type: append ? "APPEND_ORDERS" : "REPLACE_ORDERS",
                orders
            }))
    }
}

export const createOrderAction = (subscriptionId: string) => {
    return (dispatch: Dispatch) => {
        createOrder(subscriptionId)
            .then(order => dispatch({
                type: "CREATE_ORDER",
                order
            }))
    }
}