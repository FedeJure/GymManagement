import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"
import { product } from "./modules/product/product.reducer"
import { ProductState } from "./modules/product/ProductState";
import { navigation, NavigationState } from "./modules/navigation/navigation.reducer"
import { user } from "./modules/users/users.reducer"
import { order } from "./modules/order/order.reducer"
import { UserState } from "./modules/users/UserState";
import { subscription } from "./modules/subscription/subscription.reducer"
import { SubscriptionState } from "./modules/subscription/SubscriptionState";
import { OrderState } from "./modules/order/OrderState";

export interface StoreState {
    product: ProductState,
    navigation: NavigationState
    user: UserState,
    subscription: SubscriptionState,
    order: OrderState
}
export const store = createStore(combineReducers(
    { product, navigation, user, subscription, order }),
    applyMiddleware(thunk))