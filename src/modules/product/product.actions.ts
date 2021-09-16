import { Dispatch } from "redux"
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../../services/api"
import { Product } from "./Product"
import { ProductPayload } from "./ProductPayload"

export const getProductsAction = ({ page }
    : { page: number }) => {
    return (dispatch: Dispatch) => {
        fetchProducts({ page, step: 20 })
            .then(products => {
                dispatch({
                    type: "REPLACE_PRODUCTS",
                    products
                })
            })
            .catch(error => console.error(error))

    }
}

export const addProduct = (product: ProductPayload) => {
    return (dispatch: Dispatch) => {
        createProduct(product)
            .then(product => {
                dispatch({
                    type: "CREATE_PRODUCT",
                    product
                })
            })
            .catch(error => console.error(error))

    }
}


export const removeProduct = (productId: string) => {
    return (dispatch: Dispatch) => {
        deleteProduct(productId)
            .then(() => {
                dispatch({
                    type: "REMOVE_PRODUCT",
                    productId
                })
            })
            .catch(error => console.error(error))

    }
}

export const editProduct = (product: Product) => {
    return (dispatch: Dispatch) => {
        updateProduct(product)
            .then(updatedProduct => {
                dispatch({
                    type: "EDIT_PRODUCT",
                    product: updatedProduct
                })
            })
            .catch(error => console.error(error))

    }
}