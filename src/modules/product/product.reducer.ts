import { Product } from "./Product"
import { ProductState } from "./ProductState"

const initialState: ProductState = {
    products: [],
    lastId: 1
}

export const product = (state: ProductState, action: any): ProductState => {
    if (!state) return initialState
    switch (action.type) {
        // case "ADD_PRODUCT":
        //     const newProduct: Product = {
        //         id: state.lastId,
        //         data: action.product
        //     }
        //     return {
        //         ...state,
        //         products: [...state.products, newProduct],
        //         lastId: newProduct.id + 1
        //     }
        // case "REMOVE_PRODUCT":
        //     return {
        //         ...state,
        //         products: state.products.filter(p => p.id !== action.productId)
        //     }
        // case "EDIT_PRODUCT":
        //     return {
        //         ...state,
        //         products: state.products.map(p => p.id === action.product.id ? action.product : p)
        //     }

        default:
            return state
    }
}