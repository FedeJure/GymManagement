import { UserPayload } from "./UserPayload"

export const addUser = (user: UserPayload) => {
    return {
        type: "CREATE_USER",
        user
    }
}

export const removeUser = (userId: string) => {
    return {
        type: "REMOVE_USER",
        userId
    }
}

export const editUser = (userId: string, user: UserPayload) => {
    return {
        type: "EDIT_USER",
        user: {...user, id: userId}
    }
}