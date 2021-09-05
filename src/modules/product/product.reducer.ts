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

export interface ProductAction {
    type: string,
    product: ProductPayload
}

const initialState: ProductState = {
    products: [{id: 0, name: "Clase de gimnasia 3 veces por semana", cost: 2400}],
    lastId: 1
}

export const product = (state: ProductState, action: ProductAction) : ProductState => {
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
            break;
    
        default:
            return state
            break;
    }
}