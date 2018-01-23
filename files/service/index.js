const grpc = require('grpc')
const Config = require('./config')
const V1Handlers = require('./handlers/v1')
const RoverApis = require('@rover/apis')
const async = require('async')

const server = new grpc.Server()

const storage = require('@google-cloud/storage')

const tasks = []

const healthCheckPort = Config.get('/http/port')
const HealthChecker = require("@rover-common/healthcheck-server")
const HealthCheckServer = new HealthChecker(healthCheckPort)

// default is false until we add in our own healthchecks
HealthCheckServer.start()
console.info("healthchecks on port: " + healthCheckPort)

tasks.push(function(cb) {
    let dbDSN = Config.get('/postgres/dsn')

    let defaultConfig = {
        min: 2,
        max: 5,
        idleTimeoutMillis: 30000
    }

    const parse = require("@rover-common/pg-connection-string")
    let config = Object.assign({}, defaultConfig, parse(dbDSN))

    let pg = require('pg')

    const pool = new pg.Pool(config)

    pool.connect(function(err, client, done) {
        if (err) {
            return cb(err)
        }

        console.log("Connected to postgres")
        
        done()

        return cb(null, pool)
    })
})

tasks.push(function(cb) {
    let config = {
        projectId: Config.get('/storage/credentials/project_id')
    }

    if (Config.get('/storage/credentials/key_file')) {
        config.keyFilename = Config.get('/storage/credentials/key_file') 
    } else if(Config.get('/storage/credentials/json')) {
        config.credentials = Config.get('/storage/credentials/json')
    } else {
        return cb(new Error("Neither key file or json key was defined. Unable to initialize storage"))
    }

    let storageClient = {}

    let gcs = storage(config)

    // we now make sure all storage buckets have been initalized first before moving on
    const csvFileBucket = gcs.bucket(Config.get('/storage/config/csv_bucket'))

    csvFileBucket.exists(function(err, exists) {
        if (err) {
            console.error(err)
            return cb(err)
        }

        if (exists === false) {
            return cb(new Error("CsvBucket does not exist"))
        }

        storageClient.CsvFileBucket = csvFileBucket
        return cb(null, storageClient)
    })
})

async.parallel(tasks, function(err, results) {
    if (err) {
        throw err
    }

    let PGClient = results[0]
    let StorageClient = results[1]

    const v1Service = V1Handlers.build(PGClient, StorageClient)

    server.addService(RoverApis.files.v1.Services.FilesService, v1Service)

    server.bind(`${Config.get('/host')}:${Config.get('/port')}`, grpc.ServerCredentials.createInsecure())
    server.start()


    // We are healthy and alive once the grpc server starts
    HealthCheckServer.on('readiness', function(callback) {
        // Always say we are ready to accept connections
        return callback(null)
    })


    HealthCheckServer.on('liveliness', function(callback) {
        // ping postgres to check if the connection is still alive
        PGClient.query('SELECT NOW()', (err, res) => {
            return callback(err)
        })
    })

    function gracefulShutdown() {
        server.tryShutdown(function(err) {

            if (err) {
                console.error("Could not shut down gRPC server", err)
            }

            HealthCheckServer.close(function() {
                console.info("Gracefully shutdown bye!")
                process.exit(0)
            })
        })
    }

    process.on('SIGINT', function () {
        return gracefulShutdown()
    })

    process.on('SIGTERM', function() {
        return gracefulShutdown()
    })

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
})