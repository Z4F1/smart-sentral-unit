const jwt = require("jsonwebtoken")

async function authentication(req, res, next){
    try {
        const auth = req.headers["authorization"]
        if (!auth) throwUnauthorizedError(res)

        const [tokenType, token] = auth.split(" ")
        if(tokenType.toLowerCase() != "bearer" || !token) throwUnauthorizedError(res)

        const data = await jwt.verify(token, process.env.SECRET_KEY)

        delete data.exp
        delete data.iat
        
        req.user = data
        
        next()
    } catch (error) {
        next(error)
    }
}

async function signToken(data){
    const token = await jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: "14d"
    })

    return token
}

function throwUnauthorizedError(res){
    res.status(401)
    throw new Error("Unauthorized")
}

module.exports = {
    authentication,
    signToken
}