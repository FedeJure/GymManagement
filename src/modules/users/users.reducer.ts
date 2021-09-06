import { User } from "./User"
import { UserState } from "./UserState"

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