import { Weekdays } from "../../components/createProductModal/Weekdays";
import { PayType } from "./PayType"
export interface ProductPayload {
    name: string
    payType: PayType
    price: number
    daysInWeek: Weekdays[]
}
