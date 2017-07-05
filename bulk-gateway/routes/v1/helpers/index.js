const GrpcCodes = require("@rover-common/grpc-codes")

exports.getHTTPCode = function(grpcCode) {
    return GrpcCodes.grpcToHttp(grpcCode)
}

exports.loggableError = function(err) {
    const status = err.status || 500

    return (status != 401 && status != 403 && status != 404)
}