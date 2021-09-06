export interface Product {
    id: number,
    name: string,
    cost: number,
}

export interface ProductPayload {
    name: string,
    cost: number,
}

export interface ProductState {
    products: Product[]
    lastId: number
}

const initialState: ProductState = {
    products: [{ id: 0, name: "Clase de gimnasia 3 veces por semana", cost: 2400 }],
    lastId: 1
}

export const product = (state: ProductState, action: any): ProductState => {
    if (!state) return initialState
    switch (action.type) {
        case "ADD_PRODUCT":
            const newProduct: Product = {
                id: state.lastId,
                ...action.product
            }
            return {
                ...state,
                products: [...state.products, newProduct],
                lastId: newProduct.id + 1
            }
        case "REMOVE_PRODUCT":
            return {
                ...state,
                products: state.products.filter(p => p.id !== action.productId)
            }
        case "EDIT_PRODUCT":
            return {
                ...state,
                products: state.products.map(p => p.id === action.product.id ? action.product : p)
            }

        default:
            return state
    }
}