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
    familiars: string[],
    productsSubscribed: number[],
    profilePicture: string,
    dni: string
}

type User = UserPayload & {id: number}