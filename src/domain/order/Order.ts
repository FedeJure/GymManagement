import { OrderStateEnum } from "./OrderStateEnum";

export interface Order {
    id: string
    userId: string,
    userName: string,
    productId: string,
    productName: string
    basePrice: number,
    amountPayed: number
    totalDiscount: number,
    amount: number,
    emittedDate: Date,
    subscriptionId: string
    periodPayed: Date
    state: OrderStateEnum
}