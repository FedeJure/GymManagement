import { UserPayload } from "./UserPayload";

export interface User extends UserPayload {
    id: string
    creationDate: Date
    pendingPay: boolean
}
