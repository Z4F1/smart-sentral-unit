const express = require("express")
const app = express()

require("dotenv").config()

const helmet = require("helmet")
const morgan = require("morgan")

const api = require("./api")

app.use(helmet())
app.use(morgan("tiny"))

app.use(api)

const server = app.listen(8080, () => {
    console.log("Discovery service listening on:", 8080)
})

require("./lib/graceful.js")(server)