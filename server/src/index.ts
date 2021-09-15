import express from "express"
import { json } from "body-parser"
import { initUsersRoutes } from "./user/routes"
import { initSubscriptionsRoutes } from "./subscription/routes"
import { initProductsRoutes } from "./product/routes"

const app = express()
app.use(json())
const port = 3001

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

initUsersRoutes(app)
initSubscriptionsRoutes(app)
initProductsRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})