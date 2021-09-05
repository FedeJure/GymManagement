import { ProductState } from "./product.reducer";

export const getProducts = () => (state: ProductState) => {
    return state.products
}