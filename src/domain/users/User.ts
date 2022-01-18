import { UserPayload } from "./UserPayload";
import { UserType } from "./UserType";

export interface User {
    id: string
    creationDate: Date
    pendingPay: boolean
    familiars: User[]
    type: UserType,
    name: string,
    lastname: string,
    contactEmail: string,
    contactPhone: string,
    address: string,
    birthDate: Date,
    comment: string,
    profilePicture: string,
    dni: string
}
