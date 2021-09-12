import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"
import { product } from "./modules/product/product.reducer"
import { ProductState } from "./modules/product/ProductState";
import { navigation, NavigationState } from "./modules/navigation/navigation.reducer"
import { user } from "./modules/users/users.reducer"
import { UserState } from "./modules/users/UserState";
import { subscription } from "./modules/subscription/subscription.reducer"
import { SubscriptionState } from "./modules/subscription/SubscriptionState";

export interface StoreState {
    product: ProductState,
    navigation: NavigationState
    user: UserState,
    subscription: SubscriptionState
}
export const store = createStore(combineReducers(
    { product, navigation, user, subscription }),
    applyMiddleware(thunk))