const grpc = require('grpc')
const Config = require('./config')
const Queue = require('bull')
const CsvProcessorService = require('./lib/csv-processor/v1/csv-processor_grpc_pb').CsvProcessorService


const V1Handlers = require('./handlers/v1')


const server = new grpc.Server()


var staticSegmentQueue = Queue('static-segments', Config.get('/redis/url'));

const context = {
    queues: {
        staticSegment: staticSegmentQueue
    }
}

server.addService(CsvProcessorService, V1Handlers.build(context))

server.bind(`${Config.get('/host')}:${Config.get('/port')}`, grpc.ServerCredentials.createInsecure())
server.start()

console.log("Started")

