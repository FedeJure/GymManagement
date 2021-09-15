import { Express, Request, Response } from "express"

export const initSubscriptionsRoutes = (app: Express) => {
    app.post('/pay', (req: Request, res: Response) => {
        const {orderId, amount} = req.body
    })

    app.post('/order', (req: Request, res: Response) => {
        const {subscriptionId} = req.body

    })
}