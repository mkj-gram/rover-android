const RoverApis = require("@rover/apis")
const Client = RoverApis.files.v1.Services.FilesClient
const grpc = require('grpc')
const Config = require('./config')

const client = function(opts) {

    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.get('/files/host')
    const port = opts.port || Config.get('/files/port')

    const connection = `${host}:${port}`

    console.info("Files new Client: " + connection)

    return new Client(connection, grpc.credentials.createInsecure())
}


module.exports = {
    v1: {
        Client: client
    }
}