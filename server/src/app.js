const express = require('express')
const cors = require("cors");
swaggerUi = require("swagger-ui-express");
swaggerDocument = require('../swagger.json');
require('./db/mongoose')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')
const app = express()


app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use(cors())
app.use(express.json())

app.use(adminRouter)
app.use(userRouter)

module.exports = app