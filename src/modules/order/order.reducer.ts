import { OrderState } from "./OrderState";

const initialState: OrderState = {
    orders: []
}

export const order = (state: OrderState, action: any): OrderState => {
    if (!state) return initialState
    switch (action.type) {
        case "REPLACE_ORDERS":
            return {
                ...state,
                orders: action.orders
            }
        case "APPEND_ORDERS":
            return {
                ...state,
                orders: [...state.orders, ...action.orders]
            }
        case "CREATE_ORDER":
            return {
                ...state,
                orders: [...state.orders, action.order]
            }
        default:
            return state
    }
}