import { Product } from "../product/Product";
import { User } from "../users/User";

export interface CollectionOrder {
    id: string
    user: User,
    product: Product,
    emittedDate: Date,
    limitDate: Date
}