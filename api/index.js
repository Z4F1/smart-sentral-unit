const router = require("express").Router()
const auth = require("./auth")

const users = require("./users")
const devices = require("./devices")

router.use("/users", users)
router.use(auth.authentication)
router.use("/devices", devices)

module.exports = router