import { Product } from "./Product"
import { ProductState } from "./ProductState"

const initialState: ProductState = {
    products: [],
}

export const product = (state: ProductState, action: any): ProductState => {
    if (!state) return initialState
    switch (action.type) {
        case "REPLACE_PRODUCTS":
            return {
                ...state,
                products: action.products
            }
        case "CREATE_PRODUCT":
            return {
                ...state,
                products: [...state.products, action.product]
            }
        case "REMOVE_PRODUCT":
            return {
                ...state,
                products: state.products.filter(p => p.id !== action.productId)
            }
        case "EDIT_PRODUCT":
            return {
                ...state,
                products: [...state.products.filter(p => p.id !== action.product.id), action.product]
            }

        default:
            return state
    }
}