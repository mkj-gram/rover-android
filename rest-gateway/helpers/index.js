exports.makeError = function(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}

exports.mustAuthenticate = function(req, res, next) {
    if (req.auth === undefined || req.auth.context === undefined) {
        return next(exports.makeError(401, "Unauthorized"))
    }

    return next()
}
