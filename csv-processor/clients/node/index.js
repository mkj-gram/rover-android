const services = require('./lib/csv-processor/v1/csv-processor_grpc_pb')
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

    return new services.CsvProcessorClient(connection, grpc.credentials.createInsecure())
}


module.exports = {
    CsvProcessor: {
        V1: {
            Client: client, 
            Models: Object.assign( {}, require('./lib/csv-processor/v1/csv-processor_pb'), require('google-protobuf/google/protobuf/timestamp_pb.js'))
        }
    }
}