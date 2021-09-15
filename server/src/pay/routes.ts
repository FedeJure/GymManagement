import { Express, Request, Response } from "express"
import { generateOrder, getOrders, getPayments, payOrder } from "."
import { Order } from "../../../src/modules/order/Order"

export const initPaymentRoutes = (app: Express) => {
    app.post('/pay', (req: Request, res: Response) => {
        const { orderId, amount } = req.body
        payOrder(orderId, amount)
            .then(payment => {
                res.status(200).send({ payment })
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })

    app.post('/order', (req: Request, res: Response) => {
        const { subscriptionId } = req.body
        generateOrder(subscriptionId)
            .then((order: Order) => {
                res.status(200).send({ ok: true, order })
            })
            .catch((error: Error) => {
                res.status(500).send({ error })
            })
    })

    app.get('/orders', (req: Request, res: Response) => {
        const { page, step } = req.query
        getOrders({ page: parseInt(page as string, 10), step: parseInt(step as string, 10) })
            .then(orders => {
                res.status(200).send(orders)
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })


    app.get('/payments', (req: Request, res: Response) => {
        const { page, step } = req.query
        getPayments({ page: parseInt(page as string, 10), step: parseInt(step as string, 10) })
            .then(payments => {
                res.status(200).send(payments)
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })
}