import { Dispatch } from "redux"
import { UserPayload } from "./UserPayload"
import { fetchUsers, createUser, deleteUser, updateUser } from "../../services/api"

export const getUsersAction = ({page, append}:{page: number, append?: boolean}) => {
    return (dispatch: Dispatch) => {
        fetchUsers(page, 20)
            .then(users => {
                dispatch({
                    type: append ? "APPEND_USERS" : "REPLACE_USERS",
                    users
                })
            })
    }
}

export const addUser = (user: UserPayload) => {
    return (dispatch: Dispatch) => {
        createUser(user)
            .then(user => {
                dispatch({
                    type: "CREATE_USER",
                    user
                })
            })
    }
}


export const removeUser = (userId: string) => {
    return (dispatch: Dispatch) => {
        deleteUser(userId)
            .then(() => {
                dispatch({
                    type: "REMOVE_USER",
                    userId
                })
            })
    }
}

export const editUser = (userId: string, userPayload: UserPayload) => {
    const user = { id: userId, ...userPayload }
    return (dispatch: Dispatch) => {
        updateUser(user)
            .then(updatedUser => {
                dispatch({
                    type: "EDIT_USER",
                    user: updatedUser
                })
            })
    }
}