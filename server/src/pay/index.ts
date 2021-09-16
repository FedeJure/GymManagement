import { Subscription } from "../../../src/modules/subscription/Subscription"
import { PayRecipePayload } from "../../../src/modules/payRecipe/PayRecipePayload"
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
                    cancelled: false,
                    amountPayed: 0
                }
            )
        })
}

export const getOrders = async ({ page, step, contentFilter, completed, cancelled }
    : { page: number, step: number, contentFilter?: string, completed?: boolean, cancelled?: boolean }) => {
    const orderModel = getOrderModel()
    let queries: any[] = []

    if (contentFilter) {
        const filters = contentFilter.split(',')
        filters.forEach(f => {
            queries = [...queries,
            { cancelled },
            { completed }]
        })
    }
    const withQueries = contentFilter != undefined || completed != undefined || cancelled != undefined
    return orderModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
}

export const getPayments = ({ page, step }
    : { page: number, step: number }) => {
    const payRecipeModel = getPayRecipeModel()

    return payRecipeModel.find({}, null, { skip: step * page, limit: step })
}

export const payOrder = async (orderId: string, amount: number) => {
    return new Promise(async (res, error) => {
        try {
            const orderModel = getOrderModel()
            const payRecipeModel = getPayRecipeModel()
            const order = await orderModel.findOne({ _id: orderId, cancelled: false, completed: false })
            if (!order) return error("Error desconocido")
            const newPay: PayRecipePayload = {
                order,
                amount,
                emittedDate: new Date()
            }

            const payment = await payRecipeModel.create(newPay)
            const amountPayed = order.amountPayed + amount
            order.amountPayed = amountPayed
            order.completed = amountPayed >= order.amount
            await order.save()
            payment.order = order
            await payment.save()
            console.log(order)
            res(payment)
        } catch (err) {
            error(err)
        }

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