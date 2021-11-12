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
    completed: boolean,
    cancelled: boolean
    subscriptionId: string
}