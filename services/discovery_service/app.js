const express = require("express")
const app = express()

require("dotenv").config()

const helmet = require("helmet")
const morgan = require("morgan")

const api = require("./api")

app.use(helmet())
app.use(morgan("tiny"))

app.use(api)

app.listen(80, () => {
    console.log("running")
})