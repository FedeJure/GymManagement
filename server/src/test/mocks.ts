import { ObjectId } from "mongodb";
import { Weekdays } from "../../../src/components/createProductModal/Weekdays";
import { PayType } from "../../../src/modules/product/PayType";
import { ProductPayload } from "../../../src/modules/product/ProductPayload";
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload";
import { UserPayload } from "../../../src/modules/users/UserPayload";
import { UserType } from "../../../src/modules/users/UserType";
import { getProductModel, getUserModel } from "../mongoClient";

export const MockUserId = new ObjectId()
export const MockProductId = new ObjectId()

export const InitUserOnDb = async () => {
    const userModel = getUserModel()
    return await userModel.create({...MockUserPayload, _id: MockUserId})
}

export const InitProductOnDb = async () => {
    const productModel = getProductModel()
    return await productModel.create({...MockProductPayload, _id: MockProductId})
}

export const MockUserPayload: UserPayload = {
    type: UserType.STUDENT,
    name: "Mock User",
    lastname: "Mock Lastname",
    contactEmail: "mock@email.com",
    contactPhone: "99999999",
    address: "Fake address 123",
    birthDate: new Date(),
    comment: "Fake comment",
    familiars: [],
    productsSubscribed: [],
    profilePicture: "",
    dni: "112333232"
}

export const MockProductPayload: ProductPayload = {
    name: "Mock Product",
    payType: PayType.MONTHLY,
    price: 1000,
    twoSubscriptionsDiscount: 0,
    threeSubscriptionsDiscount: 0,
    fourSubscriptionsDiscount: 0,
    fiveOrMoreSubscriptionsDiscount: 0,
    daysInWeek: [Weekdays.Monday]
}

export const MockSubscriptionPayload: SubscriptionPayload = {
    userId: MockUserId.toString(),
    productId: MockProductId.toString(),
    specialDiscount: 0,
    initialTime: new Date(),
    comment: "comment"
}