import { ProductAction } from "./product.reducer"

export const addProduct = (product: {name: string, price: string}): ProductAction => {
    return {
        type: "ADD_PRODUCT",
        product: {
            name: product.name,
            cost: parseFloat(product.price)
        }
    }
}