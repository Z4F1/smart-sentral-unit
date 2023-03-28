const mongoose = require("mongoose")
const { Schema } = mongoose

const bcrypt = require("bcrypt")

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Parameter username not set"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Parameter password not set"]
    },
    name: {
        type: String,
        required: [true, "Parameter name not set"]
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(next) {
    let user = this

    if (!user.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT))
        const hash = await bcrypt.hash(user.password, salt)

        user.password = hash
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePasswords = async function(pass){
    let user = this

    return new Promise(async (res, rej) => {
        try {
            const passwordMatch = await bcrypt.compare(pass, user.password)

            console.log(passwordMatch)

            res(passwordMatch)
        } catch (error) {
            rej(error)
        }
    })
}

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel