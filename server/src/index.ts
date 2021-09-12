import express, { Request, Response } from "express"
import { json } from "body-parser"
import { UserPayload } from "../../src/modules/users/UserPayload"
import { Product } from "../../src/modules/product/Product"
import { User } from "../../src/modules/users/User"
import { getUsers, saveUser, removeUser, updateUser } from "./user/index"
import { ProductPayload } from "../../src/modules/product/ProductPayload"
import { saveProduct, updateProduct, removeProduct, getProducts } from "./product"
const app = express()
app.use(json())
const port = 3001


app.get('/users', (req: Request, res: Response) => {
  const { page, step } = req.query

  getUsers({ page: parseInt(page as string, 10), step: parseInt(step as string, 10) })
    .then(users => {
      res.status(200).send(users)
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.post('/user', (req: Request, res: Response) => {
  const { user }: { user: UserPayload } = req.body

  saveUser(user)
    .then(() => {
      res.status(200).send({ ok: true })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.delete('/user', (req: Request, res: Response) => {
  const { userId } = req.body

  removeUser(parseInt(userId as string, 10))
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
    .then(() => {
      res.status(200).send({ ok: true })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.get('/products', (req: Request, res: Response) => {
  const { page, step } = req.body

  getProducts({ page, step })
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
    .then(() => {
      res.status(200).send({ ok: true })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.delete('/product', (req: Request, res: Response) => {
  const { productId } = req.body

  removeProduct(parseInt(productId as string, 10))
    .then(() => {
      res.status(200).send({ ok: true })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.put('/product', (req: Request, res: Response) => {
  const { product }: { product: Product } = req.body

  updateProduct(product)
    .then(() => {
      res.status(200).send({ ok: true })
    })
    .catch(error => {
      res.status(500).send({ error })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})