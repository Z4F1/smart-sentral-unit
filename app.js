const express = require("express")
const app = express()

const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")

const middleware = require("./middleware")
const api = require("./api")

require("dotenv").config()

mongoose.connect(process.env.DATABASE)

app.use(express.json())
app.use(helmet())
app.use(morgan("\x1b[40m\x1b[0m\x1b[1m[:date[clf]] \x1b[36m Code: :status \x1b[35m Time: :response-time ms \x1b[33m Length: :res[content-length] \x1b[34mRequested: \":method :url HTTP/:http-version\"\x1b[0m"))


app.use(middleware.jsonResponseFunction)

app.get("/health", (req, res) => {
    res.json("healthy")
})

app.use("/api", api)

app.use(middleware.notFound)
app.use(middleware.errorHandler)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("Listening on port: %d", port)
})