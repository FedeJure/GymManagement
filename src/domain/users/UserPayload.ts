import { User } from "./User"
import {UserType} from "./UserType"
export interface UserPayload {
    type: UserType,
    name: string,
    lastname: string,
    contactEmail: string,
    contactPhone: string,
    address: string,
    birthDate: Date,
    comment: string,
    familiarIds: string[],
    profilePicture: string,
    dni: string
}

export const getUserPayload = (user: User) : UserPayload=> {
    return {
                type: user.type,
                name: user.name,
                lastname: user.lastname,
                contactEmail: user.contactEmail,
                contactPhone: user.contactPhone,
                address: user.address,
                birthDate: user.birthDate,
                comment: user.comment,
                familiarIds: user.familiars.map(f => f.id),
                profilePicture: user.profilePicture,
                dni: user.dni
              }
}