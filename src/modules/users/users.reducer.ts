import { User } from "./User"
import { UserState } from "./UserState"
import { UserType } from "./UserType"

const initialState: UserState = {
    users: [{
        id: 0,
        data: {
            name: "Federico",
            lastname: "Jure",
            birthDate: new Date(1995, 4, 10),
            type: UserType.ADMIN,
            productsSubscribed: [],
            contactEmail: "fedejure@gmail.com",
            contactPhone: "1123965448",
            profilePicture: "",
            brothers: [],
            comment: "",
            address: ""
        }
    }],
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