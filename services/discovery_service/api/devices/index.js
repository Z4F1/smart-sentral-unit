const router = require("express").Router()

router.get("/", (req, res, next) => {
    res.json([
        {
            "deviceId": "lamp_01",
            "ip": "10.0.0.13"
        }
    ])
})

router.post("/", (req, res, next) => {

})

module.exports = router