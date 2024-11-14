const router = require("express").Router()

const devices = require("./devices")

router.use("/devices", devices)

module.exports = router