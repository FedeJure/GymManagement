import { Express, Request, Response } from "express";
import {
  cancelOrder,
  generateOrderAndUpdateSubscription,
  getOrders,
  getPayments,
  payOrder,
} from ".";
import { Order } from "../../../src/modules/order/Order";

export const initPaymentRoutes = (app: Express) => {
  app.post("/pay", (req: Request, res: Response) => {
    const { orderId, amount } = req.body;
    payOrder(orderId, amount)
      .then((payment) => {
        res.status(200).send({ payment });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.post("/order", (req: Request, res: Response) => {
    const { subscriptionId } = req.body;
    generateOrderAndUpdateSubscription(subscriptionId)
      .then((order: Order | null) => {
        if (order) res.status(200).send({ ok: true, order });
        else
          res
            .status(400)
            .send({
              ok: false,
              message: "Already submitted order for this period",
            });
      })
      .catch((error: Error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.delete("/order", (req: Request, res: Response) => {
    const { orderId } = req.body;
    cancelOrder(orderId)
      .then((order: Order) => {
        res.status(200).send({ ok: true, order });
      })
      .catch((error: Error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.get("/orders", (req: Request, res: Response) => {
    const { page, step, cancelled, completed, contentFilter } = req.query;

    getOrders({
      page: parseInt(page as string, 10),
      step: parseInt(step as string, 10),
      cancelled: cancelled !== undefined ? cancelled === "true" : undefined,
      completed: completed !== undefined ? completed === "true" : undefined,
      contentFilter: contentFilter?.toString(),
    })
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.get("/payments", (req: Request, res: Response) => {
    const { page, step } = req.query;
    getPayments({
      page: parseInt(page as string, 10),
      step: parseInt(step as string, 10),
    })
      .then((payments) => {
        res.status(200).send(payments);
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });
};
