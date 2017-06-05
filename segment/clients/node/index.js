const RoverApis = require("@rover/apis")
const Client = RoverApis.segment.v1.Services.SegmentClient
const grpc = require('grpc')
const Config = require('./config')

const client = function(opts) {

    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.get('/segment/host')
    const port = opts.port || Config.get('/segment/port')

    const connection = `${host}:${port}`

    console.info("Segment new Client: " + connection)

    return new Client(connection, grpc.credentials.createInsecure())
}


module.exports = {
    v1: {
        Client: client
    } 
}