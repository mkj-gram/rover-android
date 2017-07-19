const grpc = require('grpc')
const Config = require('./config')
const Queue = require('bull')
const V1Handlers = require('./handlers/v1')
const RoverApis = require("@rover/apis")
const CsvProcessorService =  RoverApis['csv-processor'].v1.Services.CsvProcessorService
const server = new grpc.Server()
const Redis = require('ioredis')



var opts = {
    redis: {
        opts: {
            createClient: function(type) {
                
                const redis = new Redis(Config.get('/redis/url'), {
                    reconnectOnError: function (err) {
                        var targetError = /READONLY|ECONNRESET/;
                        if (err.message.match(targetError)) {
                            return true;
                        }
                    }
                })

                redis.on('connect', function(){
                    console.info("[redis] " + type + " connect")
                })

                redis.on('ready', function() {
                    console.info("[redis] " + type + " ready")
                })

                redis.on('error', function(err) {
                    console.error("[redis] " + type + " error", err)
                })

                redis.on('close', function() {
                    console.info("[redis] " + type + " close")
                })

                redis.on('reconnecting', function() {
                    console.info("[redis] " + type + " reconnecting")
                })

                redis.on('end', function() {
                    console.info("[redis] " + type + " end")
                })

                return redis
            }
        }
    }
}

var staticSegmentQueue = Queue('static-segments', opts);
var loadJobQueue = Queue('load-jobs', opts)

const context = {
    queues: {
        staticSegment: staticSegmentQueue,
        loadJob: loadJobQueue
    }
}

server.addService(CsvProcessorService, V1Handlers.build(context))

server.bind(`${Config.get('/host')}:${Config.get('/port')}`, grpc.ServerCredentials.createInsecure())
server.start()

/*
    Setup Sentry if enabled
 */
if (Config.get('/raven/enabled')) {
    var Raven = require('raven');
    Raven.config(Config.get('/raven/dsn'))
    console.info("Raven Sentry enabled")
}

/*
    Catch all errors, do not crash the application
 */
process.on('uncaughtException', function (err) {
    if (Config.get('/raven/enabled')) {
        Raven.captureException(err)
    } else {
        console.error(err)
    }
})

console.log("Started")

