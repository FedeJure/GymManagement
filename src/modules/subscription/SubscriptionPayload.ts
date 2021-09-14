export interface SubscriptionPayload {
    user: string
    product: string
    initialTime: Date
    endTime?: Date
    comment: string
}