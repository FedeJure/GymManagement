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
    brothers: number[],
    productsSubscribed: number[],
    profilePicture: string 
}