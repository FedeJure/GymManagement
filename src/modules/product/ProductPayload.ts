import { Weekdays } from "../../components/createProductModal/Weekdays";
import { PayType } from "./PayType"
export interface ProductPayload {
    name: string
    payType: PayType
    price: number
    oneFamiliarDiscount: number,
    twoFamiliarDiscount: number,
    threeFamiliarDiscount: number,
    fourOrMoreFamiliarDiscount: number,
    daysInWeek: Weekdays[]
}
