import { Subscription } from "../../../src/modules/subscription/Subscription"
import { getOrderModel, getPayRecipeModel, getSubscriptionModel } from "../mongoClient"

export const generateOrder = (subscriptionId: string) => {
    const orderModel = getOrderModel()
    const subscriptionModel = getSubscriptionModel()
    return subscriptionModel.findOne({ _id: subscriptionId })
        .populate(["user", "product"])
        .then((subscription: Subscription) => {
            const discount = calculateDiscount(subscription)
            return orderModel.create(
                {
                    userId: subscription.user.id,
                    userName: subscription.user.name,
                    productId: subscription.product.id,
                    productName: subscription.product.name,
                    basePrice: subscription.product.price,
                    totalDiscount: discount,
                    amount: getFinalAmount(subscription.product.price, discount),
                    emittedDate: new Date(),
                    completed: false,
                    cancelled: false
                }
            )
        })

}

const calculateDiscount = (subscription: Subscription) => {
    let discount = 0
    switch (subscription.user.brothers.length) {
        case 0:
            break;
        case 1:
            discount += subscription.product.oneFamiliarDiscount
            break;
        case 2:
            discount += subscription.product.twoFamiliarDiscount
            break;
        case 3:
            discount += subscription.product.threeFamiliarDiscount
            break;
        case 4:
            discount += subscription.product.fourOrMoreFamiliarDiscount
            break;
        default:
            break;
    }
    return Math.max(subscription.specialDiscount, discount)
}

const getFinalAmount = (base: number, discount: number) => {
    return Math.max(base - ((discount / 100) * base), 0);
}

export const payOrder = (orderId: string, amount: number) => {

}