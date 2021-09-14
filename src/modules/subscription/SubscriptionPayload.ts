export interface SubscriptionPayload {
    userId: string
    productId: string
    initialTime: Date
    endTime?: Date
    comment: string
}