const grpc = require('grpc')
const SegmentV1Service = require("./lib/segment/v1/segment_grpc_pb").SegmentService
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

    const config = {
        host: Config.get('/postgres/host'),
        port: Config.get('/postgres/port'),
        user: Config.get('/postgres/username'),
        password: Config.get('/postgres/password'),
        database: Config.get('/postgres/database'),
        ssl: Config.get('/postgres/ssl/enabled'),
    };

    if (Config.get('/postgres/ssl/cert')) {
        config.cert = Buffer.from(Config.get('/postgres/ssl/cert'))
    }

    if (config.ssl == true && config.cert === undefined) {
        return callback(new Error("Postgres ssl is enabled but no cert was given"))
    }

    let pg = require('pg')

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


