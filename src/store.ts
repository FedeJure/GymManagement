import { combineReducers, createStore } from "redux";
import { product } from "./modules/product/product.reducer"
import { ProductState } from "./modules/product/ProductState";
import { navigation, NavigationState } from "./modules/navigation/navigation.reducer"
import { user } from "./modules/users/users.reducer"
import { UserState } from "./modules/users/UserState";

export interface StoreState {
    product: ProductState,
    navigation: NavigationState
    user: UserState
}
export const store = createStore(combineReducers({ product, navigation, user }))