import { getOptionsWithBody, url } from "."
import { Product } from "../../modules/product/Product"
import { ProductPayload } from "../../modules/product/ProductPayload"

function mapToProduct(product: any): Product {
    return {
        ...product,
        id: product._id
    }
}
//====PRODUCT=====
export const fetchProducts = ({ page, step }: { page: number, step: number }): Promise<Product[]> => {
    return fetch(`${url}/products?page=${page}&step=${step}`)
        .then(response => response.json())
        .then(response => response.map(mapToProduct))
}

export const createProduct = (product: ProductPayload): Promise<Product> => {
    const options = getOptionsWithBody({ product }, "POST")
    return fetch(`${url}/product`, options)
        .then(response => response.json())
        .then(response => mapToProduct(response.product))
}

export const updateProduct = (product: Product) => {
    const options = getOptionsWithBody({ product }, "PUT")
    return fetch(`${url}/product`, options)
        .then(response => response.json())
        .then(response => mapToProduct(response.product))
}

export const deleteProduct = (productId: string) => {
    const options = getOptionsWithBody({ productId }, "DELETE")
    return fetch(`${url}/product`, options)
        .then(response => response.json())
}