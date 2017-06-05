const RoverApis = require("@rover/apis")
const Client = RoverApis['csv-processor'].v1.Services.CsvProcessorClient
const grpc = require('grpc')
const Config = require('./config')

const client = function(opts) {

    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.get('/csv_processor/host')
    const port = opts.port || Config.get('/csv_processor/port')

    const connection = `${host}:${port}`

    console.info("CSV-Processor new Client: " + connection)

    return new Client(connection, grpc.credentials.createInsecure())
}


module.exports = {
    v1: {
        Client: client
    }
}