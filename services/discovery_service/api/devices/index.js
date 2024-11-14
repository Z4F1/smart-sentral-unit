const router = require("express").Router()

router.get("/", (req, res, next) => {
    res.json([
        {
            "deviceId": "lamp_01"
        }
    ])
})

module.exports = router