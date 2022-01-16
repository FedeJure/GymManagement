import { Express, Request, Response } from "express";
import { SubscriptionPayload } from "../../../src/domain/subscription/SubscriptionPayload";
import {
    getConfig,
  getSubscriptions,
  removeSubscription,
  saveSubscription,
} from "./index";

export const initSubscriptionsRoutes = (app: Express) => {
  app.get("/subscriptions", (req: Request, res: Response) => {
    const { page, step, contentFilter } = req.query;

    getSubscriptions({
      page: parseInt(page as string, 10),
      step: parseInt(step as string, 10),
      contentFilter: contentFilter as string,
    })
      .then((subscriptions) => {
        res.status(200).send(subscriptions);
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.post("/subscription", (req: Request, res: Response) => {
    const { subscription }: { subscription: SubscriptionPayload } = req.body;

    saveSubscription(subscription)
      .then((subscription) => {
        res.status(200).send({ ok: true, subscription });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.delete("/subscription", (req: Request, res: Response) => {
    const { subscriptionId } = req.body;

    removeSubscription(subscriptionId)
      .then(() => {
        res.status(200).send({ ok: true });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.get("/subscription/config", (req: Request, res: Response) => {
    getConfig().then((config) => {
      res.status(200).send(config);
    })
    .catch((error) => {
      res.status(500).send({ok: false, message: error.message})
  });
  });
};
