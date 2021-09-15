import { Dispatch } from "redux"
import { UserPayload } from "./UserPayload"
import { fetchUsers, createUser, deleteUser, updateUser } from "../../services/api"

export const getUsersAction = ({page, append, filterByTag, filterByContent}
    :{page: number, append?: boolean, filterByTag?: string[], filterByContent?: string[]}) => {
    return (dispatch: Dispatch) => {
        fetchUsers({page, step: 20, filterByTag, filterByContent})
            .then(users => {
                dispatch({
                    type: append ? "APPEND_USERS" : "REPLACE_USERS",
                    users
                })
            })
            .catch(error => console.error(error))

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
            .catch(error => console.error(error))

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
            .catch(error => console.error(error))

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
            .catch(error => console.error(error))
    }
}