export interface SubscriptionPayload {
    userId: number;
    productId: number;
    initialTime: Date;
    endTime?: Date;
}