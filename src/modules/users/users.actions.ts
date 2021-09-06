import { UserPayload } from "./users.reducer"

export const addUser = (user: UserPayload) => {
    return {
        type: "CREATE_USER",
        user
    }
}

export const removeUser = (userId: number) => {
    return {
        type: "REMOVE_USER",
        userId
    }
}

export const editUser = (userId: number, user: UserPayload) => {
    return {
        type: "EDIT_USER",
        user: {...user, id: userId}
    }
}