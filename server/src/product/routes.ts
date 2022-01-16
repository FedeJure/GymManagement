import { Express, Request, Response } from "express";
import { Product } from "../../../src/domain/product/Product";
import { ProductPayload } from "../../../src/domain/product/ProductPayload";
import {
  getProducts,
  saveProduct,
  updateProduct,
  removeProduct,
  getConfig,
} from "./index";

export const initProductsRoutes = (app: Express) => {
  app.get("/products", (req: Request, res: Response) => {
    const { page, step, contentFilter } = req.query;

    getProducts({
      page: parseInt(page as string, 10),
      step: parseInt(step as string, 10),
      contentFilter: contentFilter as string,
    })
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.post("/product", (req: Request, res: Response) => {
    const { product }: { product: ProductPayload } = req.body;

    saveProduct(product)
      .then((product) => {
        res.status(200).send({ ok: true, product });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.delete("/product", (req: Request, res: Response) => {
    const { productId } = req.body;

    removeProduct(parseInt(productId as string, 10))
      .then((product) => {
        res.status(200).send({ ok: true, product });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.put("/product", (req: Request, res: Response) => {
    const { product }: { product: Product } = req.body;
    updateProduct(product)
      .then((updatedProduct) => {
        res.status(200).send({ ok: true, product: updatedProduct });
      })
      .catch((error) => {
        res
          .status(503)
          .send({ ok: false, message: error.message, stacktrace: error.stack });
      });
  });

  app.get("/product/config", (req: Request, res: Response) => {
    getConfig().then((config) => {
      res.status(200).send(config);
    })
    .catch((error) => {
        res.status(500).send({ok: false, message: error.message})
    });
  });
};
