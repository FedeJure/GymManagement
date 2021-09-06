

export interface User {
    id: number,
    data: UserPayload
}

export interface UserPayload {
    name: string,
    lastname: string,
    contactEmail: string,
    contactPhone: string,
    address: string,
    birthDate: Date,
    comment: string,
    brothers: number[],
    productsSubscribed: number[]  
}


export interface UserState {
    users: User[],
    lastId: number
}

const initialState: UserState = {
    users: [],
    lastId: 1,
}

export const user = (state: UserState, action: any): UserState => {
    if (!state) return initialState
    switch (action.type) {
        case "CREATE_USER":
            const user: User = {
                id: state.lastId,
                data: {...action.user}
            }
            return {
                ...state,
                lastId: state.lastId + 1,
                users: [...state.users, user]
            }
        case "EDIT_USER":
            return {
                ...state,
                users: state.users.map(u => u.id === action.user.id ? action.user : u)
            }
        case "REMOVE_USER":
            return {
                ...state,
                users: state.users.filter(u => u.id !== action.userId)
            }

        default:
            return state
    }
}