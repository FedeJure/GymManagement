import { User } from "./User";

export interface UserState {
    users: User[],
    lastId: number
}