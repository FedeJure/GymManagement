import { Product } from "../product/Product"
import { User } from "../users/User"

export interface Subscription {
    id: string,
    user: User
    product: Product
    specialDiscount: number,
    initialTime: Date
    endTime?: Date
    comment: string
    creationDate: Date
}