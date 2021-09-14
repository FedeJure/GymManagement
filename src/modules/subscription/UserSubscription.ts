import { Product } from "../product/Product";
import { User } from "../users/User";
import { Subscription } from "./Subscription";

export type UserSubscription = Subscription & {user: User, product: Product}