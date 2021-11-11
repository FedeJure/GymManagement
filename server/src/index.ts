import express from "express"
import { json } from "body-parser"
import { initUsersRoutes } from "./user/routes"
import { initSubscriptionsRoutes } from "./subscription/routes"
import { initProductsRoutes } from "./product/routes"
import { initPaymentRoutes } from "./pay/routes"
import { PORT } from "./configs"
import { generateNewPayOrdersIfNeeded } from "./subscription"

const app = express()
app.use(json())

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

initUsersRoutes(app)
initSubscriptionsRoutes(app)
initProductsRoutes(app)
initPaymentRoutes(app)

app.listen(PORT, () => {
  console.log(`Example app listening at ${PORT}`)
  generateNewPayOrdersIfNeeded()
  setInterval(generateNewPayOrdersIfNeeded, 3600000 /** 1 hour */)
})