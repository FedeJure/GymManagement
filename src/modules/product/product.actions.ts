import { ProductPayload } from "./ProductPayload"

export const addProduct = (product: ProductPayload) => {
    return {
        type: "ADD_PRODUCT",
        product
    }
}

export const removeProduct = (productId: number) => {
    return {
        type: "REMOVE_PRODUCT",
        productId
    }
}

export const editProduct = (productId:number, data: ProductPayload) => {
    return {
        type: "EDIT_PRODUCT",
        product: {
            id: productId,
            name: data.name,
            cost: data.cost
        }
    }
}