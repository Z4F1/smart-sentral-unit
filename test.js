const app = require("express")()

app.get("/", (req, res) => {
    res.json(req.query.on != undefined)
})

app.get("/state", (req, res) => {
    res.json({
        on: true
    })
})

app.listen(8080)