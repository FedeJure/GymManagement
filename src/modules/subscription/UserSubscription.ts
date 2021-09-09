import { ProductPayload } from "../product/ProductPayload";
import { UserPayload } from "../users/UserPayload";
import { Subscription } from "./Subscription";

export interface UserSubscription {
    user: UserPayload,
    product: ProductPayload
    subscription: Subscription
}