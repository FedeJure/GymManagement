import { Order } from "../order/Order";

export interface PayRecipePayload {
    order: Order,
    amount: number,
    emittedDate: Date
}