import { Product } from "../product/Product"
import { User } from "../users/User"

export interface Subscription {
    user: User
    product: Product
    initialTime: Date
    endTime?: Date
    comment: string
}