const router = require("express").Router()
const auth = require("../auth")

const UserModel = require("./UserModel")

router.post("/login", async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username })

        if(user != null){
            const passwordMatch = await user.comparePasswords(req.body.password)

            if (passwordMatch){
                const token = await auth.signToken({_id: user._id})
                res.json(token)
            }else{
                res.status(401)
                throw new Error("Wrong credentials")
            }
        }else {
            res.status(401)
            throw new Error("Wrong credentials")
        }
    } catch (error) {
        next(error)
    }
})

router.use(auth.authentication)

router.get("/", async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id, "username name createdAt updatedAt")

        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const userEntry = new UserModel({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name
        })

        const user = await userEntry.save()

        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.put("/", async(req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)

        if(!req.body["password"]) {
            res.status(422)
            throw new Error("Missing password parameter to update")
        }
        
        user.password = req.body.password

        const newUserEntry = await user.save()

        res.json(newUserEntry)
    } catch (error) {
        next(error)
    }
})

module.exports = router