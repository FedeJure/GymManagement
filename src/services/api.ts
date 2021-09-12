import { UserPayload } from "../modules/users/UserPayload"
import { User } from "../modules/users/User"
import { Product } from "../modules/product/Product"
import { ProductPayload } from "../modules/product/ProductPayload"

const url = "http://localhost:3001"

function getOptionsWithBody(body: any, method: string) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}

//====USER======
export const getUsers = async (page: number, step: number) => {
    return fetch(`${url}/users?page=${page}&step=${step}`)
        .then(response => response.json())
}

export const createUser = (user: UserPayload) => {
    const options = getOptionsWithBody({ user }, "POST")
    return fetch(`${url}/user`, options)
        .then(response => response.json())
}

export const updateUser = (user: User) => {
    const options = getOptionsWithBody({ user }, "PUT")
    return fetch(`${url}/user`, options)
        .then(response => response.json())
}

export const deleteUser = (userId: number) => {
    const options = getOptionsWithBody({ userId }, "DELETE")
    return fetch(`${url}/user`, options)
        .then(response => response.json())
}

//====PRODUCT=====
export const getProducts = (page: number, step: number) => {
    return fetch(`${url}/products?page=${page}&step=${step}`)
        .then(response => response.json())
}

export const createProduct = (product: ProductPayload) => {
    const options = getOptionsWithBody({ product }, "POST")
    return fetch(`${url}/product`, options)
        .then(response => response.json())
}

export const updateProduct = (product: Product) => {
    const options = getOptionsWithBody({ product }, "PUT")
    return fetch(`${url}/product`, options)
        .then(response => response.json())
}

export const deleteProduct = (productId: number) => {
    const options = getOptionsWithBody({ productId }, "DELETE")
    return fetch(`${url}/product`, options)
        .then(response => response.json())
}