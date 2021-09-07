import { PayType } from "./PayType"
export interface ProductPayload {
    name: string
    payType: PayType
    price: number
    classPerWeek?: number
}
