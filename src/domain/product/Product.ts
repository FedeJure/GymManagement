import { User } from "../users/User";
import { ProductPayload } from "./ProductPayload";

export type Product = ProductPayload & {id: string, creationDate: Date, owners: User[]}