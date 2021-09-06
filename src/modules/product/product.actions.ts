
export const addProduct = (product: {name: string, price: string}) => {
    return {
        type: "ADD_PRODUCT",
        product: {
            name: product.name,
            cost: parseFloat(product.price)
        }
    }
}

export const removeProduct = (productId: number) => {
    return {
        type: "REMOVE_PRODUCT",
        productId
    }
}