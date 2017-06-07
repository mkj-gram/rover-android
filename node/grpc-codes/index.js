function swap(object) {
    let newObject = {}
    Object.keys(object).forEach(key => {
        let value = parseInt(object[key])
        newObject[value] = parseInt(key)
    })
    return newObject
}

const grpcCodeToHttpIndex =
{
    4: 408,
    5: 404,
    6: 409,
    7: 403,
    8: 429,
    9: 428,
    12: 501,
    13: 500,
    14: 503,
    15: 500,
    16: 401
}

const httpCodeToGrpcIndex = swap(grpcCodeToHttpIndex)


function grpcToHttp(grpcCode) {
    return (grpcCodeToHttpIndex[grpcCode] || 500)
}

function httpToGrpc(httpCode) {
    return (httpCodeToGrpcIndex[httpCode] || 0)
}


module.exports = {
    grpcToHttp: grpcToHttp,
    httpToGrpc: httpToGrpc
}