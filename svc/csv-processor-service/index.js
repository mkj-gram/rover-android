const grpc = require('grpc')
const { CsvProcessor } = require("@rover/csv-processor")
const Config = require('./config')
const Queue = require('bull');

const V1Handlers = require('./handlers/v1')


const server = new grpc.Server()


var staticSegmentQueue = Queue('static-segments', Config.get('/redis/url'));

const context = {
    queues: {
        staticSegment: staticSegmentQueue
    }
}

server.addService(CsvProcessor.V1.Server, V1Handlers.build(context))

server.bind(`${Config.get('/host')}:${Config.get('/port')}`, grpc.ServerCredentials.createInsecure())
server.start()

console.log("Started")

