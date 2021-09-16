import { Subscription } from "../../../src/modules/subscription/Subscription"
import { PayRecipePayload } from "../../../src/modules/payRecipe/PayRecipePayload"
import { getOrderModel, getPayRecipeModel, getSubscriptionModel } from "../mongoClient"

export const generateOrder = async (subscriptionId: string) => {
    const orderModel = getOrderModel()
    const subscriptionModel = getSubscriptionModel()
    const subscription = await subscriptionModel.findById(subscriptionId)
        .populate(["user", "product"])
    if (!subscription) throw new Error("Subscription not founded");
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
}

export const getOrders = async ({ page, step, contentFilter, completed, cancelled }: { page: number, step: number, contentFilter?: string, completed?: Boolean, cancelled?: Boolean }) => {
    const orderModel = getOrderModel()
    let queries: any[] = []
    let withQueries = false
    if (contentFilter) {
        withQueries = true
        const filters = contentFilter.split(',')
        filters.forEach(f => {
            queries = [...queries,
            { userName: { $regex: f, "$options": "i" } },
            { productName: { $regex: f, "$options": "i" } }]
        })
    }
    if (completed != undefined) {
        withQueries = true
        queries = [...queries, { completed }]
    }

    if (cancelled != undefined) {
        withQueries = true
        queries = [...queries, { cancelled }]
    }
    console.log(queries)
    return orderModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
}

export const getPayments = async ({ page, step }: { page: number, step: number }) => {
    const payRecipeModel = getPayRecipeModel()
    return payRecipeModel.find({}, null, { skip: step * page, limit: step })
}

export const payOrder = async (orderId: string, amount: number) => {
    const orderModel = getOrderModel()
    const payRecipeModel = getPayRecipeModel()
    const order = await orderModel.findOne({ _id: orderId, cancelled: false, completed: false })
    if (!order) throw new Error("Valid order not found");
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
    return payment
}

export const cancelOrder = async (orderId: string) => {
    const orderModel = getOrderModel()
    const order = await orderModel.findById(orderId)
    if (!order) throw Error("valid order not found")
    order.cancelled = true
    await order.save()
    return order
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