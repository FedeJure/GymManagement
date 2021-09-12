import { UserState } from "./UserState"

const initialState: UserState = {
    users: [],
}

export const user = (state: UserState, action: any): UserState => {
    if (!state) return initialState
    switch (action.type) {
        case "FETCH_USERS":
            return {
                ...state,
                users: action.users
            }
        case "CREATE_USER":
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case "EDIT_USER":
            console.log(state.users, action.user)
            return {
                ...state,
                users: [...state.users.filter(u => u.id !== action.user.id), action.user]
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