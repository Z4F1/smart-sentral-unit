const router = require("express").Router()

const DeviceModel = require("./DeviceModel")

router.get("/", async (req, res, next) => {
    try {
        const devices = await DeviceModel.find()
        
        let activeDevices = await Promise.all(
            devices.map(async (device) => {
                const state = await device.getState()
                
                return Object.assign(device._doc, {state})
            })
        )

        res.json(activeDevices)
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const deviceEntry = new DeviceModel({
            name: req.body.name,
            type: req.body.type,
            ip: req.body.ip,
            group: req.body.group
        })

        const device = await deviceEntry.save()

        res.json(device)
    } catch (error) {
        next(error)
    }
})

router.get("/trigger/:id", async(req, res, next) => {
    try {
        const device = await DeviceModel.findById(req.params.id)
        const triggered = await device.trigger(req.query)

        console.log(triggered.data)

        res.json(triggered)
    } catch (error) {
        next(error)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const device = await DeviceModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        
        res.json(device)
    } catch (error) {
        next(error)
    }
})

module.exports = router