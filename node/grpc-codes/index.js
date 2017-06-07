function swap(object) {
    let newObject = {}
    Object.keys(object).forEach(key => {
        let value = parseInt(object[key])
        newObject[value] = parseInt(key)
    })
    return newObject
}


const status = { 
    OK: 0,
    CANCELLED: 1,
    UNKNOWN: 2,
    INVALID_ARGUMENT: 3,
    DEADLINE_EXCEEDED: 4,
    NOT_FOUND: 5,
    ALREADY_EXISTS: 6,
    PERMISSION_DENIED: 7,
    UNAUTHENTICATED: 16,
    RESOURCE_EXHAUSTED: 8,
    FAILED_PRECONDITION: 9,
    ABORTED: 10,
    OUT_OF_RANGE: 11,
    UNIMPLEMENTED: 12,
    INTERNAL: 13,
    UNAVAILABLE: 14,
    DATA_LOSS: 15 
}

const grpcCodeToHttpIndex = {}

grpcCodeToHttpIndex[status.OK]                  = 200
grpcCodeToHttpIndex[status.CANCELLED]           = 408
grpcCodeToHttpIndex[status.UNKNOWN]             = 500
grpcCodeToHttpIndex[status.INVALID_ARGUMENT]    = 400
grpcCodeToHttpIndex[status.DEADLINE_EXCEEDED]   = 408
grpcCodeToHttpIndex[status.NOT_FOUND]           = 404
grpcCodeToHttpIndex[status.ALREADY_EXISTS]      = 409
grpcCodeToHttpIndex[status.PERMISSION_DENIED]   = 403
grpcCodeToHttpIndex[status.UNAUTHENTICATED]     = 401
grpcCodeToHttpIndex[status.RESOURCE_EXHAUSTED]  = 429
grpcCodeToHttpIndex[status.FAILED_PRECONDITION] = 428
grpcCodeToHttpIndex[status.UNIMPLEMENTED]       = 501
grpcCodeToHttpIndex[status.INTERNAL]            = 500
grpcCodeToHttpIndex[status.UNAVAILABLE]         = 503
grpcCodeToHttpIndex[status.DATA_LOSS]           = 500


const httpCodeToGrpcIndex = swap(grpcCodeToHttpIndex)


function grpcToHttp(grpcCode) {
    return (grpcCodeToHttpIndex[grpcCode] || 500)
}

function httpToGrpc(httpCode) {
    return (httpCodeToGrpcIndex[httpCode] || 0)
}



module.exports = {
    grpcToHttp: grpcToHttp,
    httpToGrpc: httpToGrpc,
    status: status
}