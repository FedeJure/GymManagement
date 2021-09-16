import { UserPayload } from "./UserPayload";

export type User = UserPayload & {id: string, creationDate: Date}