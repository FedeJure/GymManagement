import { combineReducers, createStore } from "redux";
import { product, ProductState } from "./modules/product/product.reducer"
import { navigation, NavigationState } from "./modules/navigation/navigation.reducer"

export interface StoreState {
    product: ProductState,
    navigation: NavigationState
}
export const store = createStore(combineReducers({ product: product, navigation: navigation }))