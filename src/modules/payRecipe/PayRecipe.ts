import { Order } from "../order/Order"

export interface PayRecipe {
    id: string
    order: Order,
    amount: number,
    emittedDate: Date
}