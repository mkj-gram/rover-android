const RoverApis = require("@rover/apis")
const Client = RoverApis.audience.v1.Services.AudienceClient
const grpc = require('grpc')
const Config = require('./config')

const client = function(opts) {

    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.host
    const port = opts.port || Config.port
    
    const connection = `${host}:${port}`

    console.info("Audience new Client: " + connection)

    return new Client(connection, grpc.credentials.createInsecure())
}


module.exports = {
    v1: {
        Client: client
    }
}