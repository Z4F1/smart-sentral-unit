const router = require("express").Router()

const devices = require("./devices")
const sensors = require("./sensors")

router.use("/devices", devices)
router.use("/sensors", devices)

module.exports = router