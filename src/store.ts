import { combineReducers, createStore } from "redux";
import { product, ProductState } from "./modules/product/product.reducer"
import { navigation, NavigationState } from "./modules/navigation/navigation.reducer"
import { user } from "./modules/users/users.reducer"

export interface StoreState {
    product: ProductState,
    navigation: NavigationState
}
export const store = createStore(combineReducers({ product, navigation, user }))