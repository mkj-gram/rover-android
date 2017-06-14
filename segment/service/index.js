require('newrelic')
const Config = require('./config')
const SegmentV1Service = require("@rover/apis").segment.v1.Services.SegmentService
const grpc = require("grpc")
const redis = require('redis')
const async = require('async')
const parse = require("@rover-common/pg-connection-string")
const V1Handlers = require('./handlers/v1')

if (Config.get('/raven/enabled')) {
    const Raven = require('raven')
    Raven.config(Config.get('/raven/dsn')).install();
}


const server = new grpc.Server()
const context = {
    clients: {}
}

/*
    setup redis
 */

let tasks = []

tasks.push(function(callback) {
    const redisOptions = { url: Config.get('/redis/url') }
    const redisClient = redis.createClient(redisOptions)

    redisClient.on('ready', function() {
        context.clients.redis = redisClient
        return callback()
    })  
})


tasks.push(function(callback) {

    let dbDSN = Config.get('/postgres/dsn')

    let defaultConfig = {
        min: 2,
        max: 5,
        idleTimeoutMillis: 30000
    }

    let config = Object.assign({}, defaultConfig, parse(dbDSN))

    let pg = require('pg')

    const pool = new pg.Pool(config)

    pool.connect(function(err, client, done) {
        if (err) {
            return callback(err)
        }

        console.log("Connected to postgres")
        
        done()

        context.clients.postgres = pool

        return callback()
    })
})


async.series(tasks, function(err) {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    server.addService(SegmentV1Service, V1Handlers.build(context))
    
    server.bind(`${Config.get('/host')}:${Config.get('/port')}`, grpc.ServerCredentials.createInsecure())
    server.start()

    console.log("Started")
})


