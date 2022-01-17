import { Weekdays } from "../../components/createProductModal/Weekdays";
import { PayType } from "./PayType"
export interface ProductPayload {
    name: string
    payType: PayType
    price: number
    twoSubscriptionsDiscount: number,
    threeSubscriptionsDiscount: number,
    fourSubscriptionsDiscount: number,
    fiveOrMoreSubscriptionsDiscount: number,
    daysInWeek: Weekdays[]
    owners: string[]
}
