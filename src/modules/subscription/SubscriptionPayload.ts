export interface SubscriptionPayload {
    userId: string
    productId: string
    specialDiscount: number,
    initialTime: Date
    endTime?: Date
    comment: string
}