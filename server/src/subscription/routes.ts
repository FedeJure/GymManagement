import { Express, Request, Response } from "express"
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload"
import { getSubscriptions, saveSubscription } from "./index"

export const initSubscriptionsRoutes = (app: Express) => {
    app.get('/subscriptions', (req: Request, res: Response) => {
        const { page, step, contentFilter } = req.query

        getSubscriptions({
            page: parseInt(page as string, 10),
            step: parseInt(step as string, 10),
            contentFilter: contentFilter as string
        })
            .then(subscriptions => {
                res.status(200).send(subscriptions)
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })

    app.post('/subscription', (req: Request, res: Response) => {
        const { subscription }: { subscription: SubscriptionPayload } = req.body

        saveSubscription(subscription)
            .then(subscription => {
                res.status(200).send({ ok: true, subscription })
            })
            .catch(error => {
                res.status(500).send({ error })
            })
    })
}