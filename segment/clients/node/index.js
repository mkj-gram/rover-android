const services = require('./lib/segment/v1/segment_grpc_pb')
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

    return new services.SegmentClient(connection, grpc.credentials.createInsecure())
}


module.exports = {
    Segment: {
        V1: {
            Client: client, 
            Models: Object.assign( {}, require('./lib/segment/v1/segment_pb'), require('google-protobuf/google/protobuf/timestamp_pb.js'))
        }
    }
}