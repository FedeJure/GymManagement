import express, { Request, Response } from "express"
import { json } from "body-parser"
import { UserPayload } from "../../src/modules/users/UserPayload"
import { Product } from "../../src/modules/product/Product"
import { User } from "../../src/modules/users/User"
import { getUsers, saveUser, removeUser, updateUser, getBrothersOfUser } from "./user/index"
import { ProductPayload } from "../../src/modules/product/ProductPayload"
import { saveProduct, updateProduct, removeProduct, getProducts } from "./product"
const app = express()
app.use(json())
const port = 3001

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/users', (req: Request, res: Response) => {
  const { page, step, tagFilter, contentFilter } = req.query

  getUsers({
    page: parseInt(page as string, 10),
    step: parseInt(step as string, 10),
    tagFilter: tagFilter as string,
    contentFilter: contentFilter as string
  })
    .then(users => {
      res.status(200).send(users)
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.get('/brothers', (req: Request, res: Response) => {
  const { userId } = req.query

  getBrothersOfUser(userId as string)
    .then(brothers => {
      res.status(200).send(brothers)
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.post('/user', (req: Request, res: Response) => {
  const { user }: { user: UserPayload } = req.body

  saveUser(user)
    .then(savedUser => {
      res.status(200).send({ ok: true, user: savedUser })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.delete('/user', (req: Request, res: Response) => {
  const { userId } = req.body

  removeUser(userId)
    .then(() => {
      res.status(200).send({ ok: true })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.put('/user', (req: Request, res: Response) => {
  const { user }: { user: User } = req.body

  updateUser(user)
    .then(updatedUser => {
      res.status(200).send({ ok: true, user: updatedUser })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.get('/products', (req: Request, res: Response) => {
  const { page, step } = req.query

  getProducts({
    page: parseInt(page as string, 10),
    step: parseInt(step as string, 10)
  })
    .then(products => {
      res.status(200).send(products)
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.post('/product', (req: Request, res: Response) => {
  const { product }: { product: ProductPayload } = req.body

  saveProduct(product)
    .then(product => {
      res.status(200).send({ ok: true, product })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.delete('/product', (req: Request, res: Response) => {
  const { productId } = req.body

  removeProduct(parseInt(productId as string, 10))
    .then(product => {
      res.status(200).send({ ok: true, product })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.put('/product', (req: Request, res: Response) => {
  const { product }: { product: Product } = req.body
  updateProduct(product)
    .then(updatedProduct => {
      res.status(200).send({ ok: true, product: updatedProduct })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})