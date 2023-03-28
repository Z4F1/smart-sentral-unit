const mongoose = require("mongoose")
const { Schema } = mongoose

const axios = require("axios")

const deviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["light", "light-dim", "light-temp", "light-rgb"],
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    group: {
        type: String,
        default: "general"
    }
}, {
    timestamps: true
})

deviceSchema.methods.trigger = async function(params){
    let device = this

    return new Promise(async (res, rej) => {
        try {
            let data
            switch (device.type) {
                case "light":
                    res(await request(`${device.ip}?on=${params.state}`))
                    break;
                case "light-dim":
                    res(await request(`${device.ip}?on=${params.state}&dim=${params.dim}`))
                    break;
                case "light-temp":
                    res(await request(`${device.ip}?on=${params.state}&dim=${params.dim}&temp=${params.temp}`))
                    break;
                case "light-rgb":
                    res(await request(`${device.ip}?on=${params.state}&red=${params.red}&green=${params.green}&blue=${params.blue}`))
                    break;
                default:
                    throw new Error("Not a supported type")
            }
        } catch (error) {
            rej(error)
        }
    })
}

deviceSchema.methods.getState = async function(){
    let device = this

    return new Promise(async (res, rej) => {
        try {
            const state = await request(`${device.ip}/state`)

            res(state)
        } catch (error) {
            rej(error)
        }
    })
}

async function request(url){
    const data = (await axios.get(url)).data

    return data
}

const DeviceModel = mongoose.model("Device", deviceSchema)

module.exports = DeviceModel 