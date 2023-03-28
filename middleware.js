function jsonResponseFunction(req, res, next) {
    let json = res.json
    res.json = function(obj){
        json.call(this, {
            environment: process.env.ENVIRONMENT_TAG,
            success: !(obj instanceof Error),
            data: (obj instanceof Error) ? undefined : obj,
            error: (obj instanceof Error) ? ((process.env.ENVIRONMENT_TAG == "prod") ? obj.message : { message: obj.message, stack: obj.stack }) : undefined,
        })
    }
    next()
}

function notFound(req, res, next) {
    const error = new Error("Not found - " + req.originalUrl)
    res.status(404);
    next(error)
}

function errorHandler(error, req, res, next){
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode)

    res.json(error)
}

module.exports = {
    jsonResponseFunction,
    notFound,
    errorHandler
}