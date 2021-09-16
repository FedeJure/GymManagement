import { ProductPayload } from "./ProductPayload";

export type Product = ProductPayload & {id: string, creationDate: Date}