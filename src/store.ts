import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"
import { product } from "./domain/product/product.reducer"
import { ProductState } from "./domain/product/ProductState";
import { navigation, NavigationState } from "./domain/navigation/navigation.reducer"
import { user } from "./domain/users/users.reducer"
import { order } from "./domain/order/order.reducer"
import { UserState } from "./domain/users/UserState";
import { subscription } from "./domain/subscription/subscription.reducer"
import { SubscriptionState } from "./domain/subscription/SubscriptionState";
import { OrderState } from "./domain/order/OrderState";

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