import { UserPayload } from "../../modules/users/UserPayload"
import { User } from "../../modules/users/User"
import { getOptionsWithBody, url } from "."

const mapToUser = (data: any) => {
    return {
        ...data,
        id: data._id,
        birthDate: new Date(data.birthDate)
    }
}
export const fetchUsers = async ({ page, step, filterByTag = [], filterByContent = [] }
    : { page: number, step: number, filterByTag?: string[], filterByContent?: string[] }): Promise<User[]> => {
    return fetch(`${url}/users?page=${page}&step=${step}${filterByTag.length > 0 ? `&tagFilter=${filterByTag.join(',')}` : ""}${filterByContent.length > 0 ? `&contentFilter=${filterByContent.join(',')}` : ""}`)
        .then(response => response.json())
        .then(response => response.map(mapToUser))
}

export const createUser = (user: UserPayload): Promise<User> => {
    const options = getOptionsWithBody({ user }, "POST")
    return fetch(`${url}/user`, options)
        .then(response => response.json())
        .then(response => response.user)
        .then(mapToUser)
}

export const updateUser = (user: User): Promise<User> => {
    const options = getOptionsWithBody({ user }, "PUT")
    return fetch(`${url}/user`, options)
        .then(response => response.json())
        .then(response => response.user)
        .then(mapToUser)
}

export const deleteUser = (userId: string) => {
    const options = getOptionsWithBody({ userId }, "DELETE")
    return fetch(`${url}/user`, options)
        .then(response => response.json())
        .then(response => response.user)
}

export const getBrothersOfUser = (userId: string): Promise<User[]> => {
    return fetch(`${url}/brothers?userId=${userId}`)
        .then(response => response.json())
        .then(response => response.map(mapToUser))
}