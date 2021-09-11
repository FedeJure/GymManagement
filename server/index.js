const express = require('express')
const app = express()
const port = 3001

const {getUsers} = require("./user/index")

app.get('/user', (req, res) => {
  getUsers({page: 0, step: 20})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})