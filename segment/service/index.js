const SegmentV1Service = require("@rover/apis").segment.v1.Services.SegmentService
const grpc = require("grpc")
const Config = require('./config')
const redis = require('redis')
const async = require('async')

const V1Handlers = require('./handlers/v1')


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

    let pg = require('pg')

    function NewClient() {
        return new pg.Client(dbDSN)
    }

    let config = {
        Client: NewClient,
        min: 2,
        max: 5,
        idleTimeoutMillis: 30000
    }
    

    const pool = new pg.Pool(config)

    pool.connect(function(err, client, done) {
        if (err) {
            return callback(err)
        }

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


