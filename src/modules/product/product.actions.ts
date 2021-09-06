
export const addProduct = (product: {name: string, cost: string}) => {
    return {
        type: "ADD_PRODUCT",
        product: {
            name: product.name,
            cost: parseFloat(product.cost)
        }
    }
}

export const removeProduct = (productId: number) => {
    return {
        type: "REMOVE_PRODUCT",
        productId
    }
}

export const editProduct = (productId:number, data: {name: string, cost: string}) => {
    return {
        type: "EDIT_PRODUCT",
        product: {
            id: productId,
            name: data.name,
            cost: data.cost
        }
    }
}