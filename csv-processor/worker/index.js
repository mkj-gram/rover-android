const Queue = require('bull')
const Config = require('./config')
const Workers = require('./workers')

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



// How long the job should be locked for until it is considered stalled
// We add 10 seconds ontop of timeout to let bull / node process the stalled job
const lockDuration = Config.get('/job/timeout') + 10000

// How often the job should renew its lock while its processing
const lockRenewTime = lockDuration / 2

// How often to look for jobs that have stalled. This call is very cpu intensive on redis
const stalledInterval = lockDuration

// Only supported in Bull 3.x
const queueOpts = {
    lockDuration: lockDuration,
    lockRenewTime: lockRenewTime,
    stalledInterval: stalledInterval
}

const staticSegmentQueue = Queue('static-segments', opts);

const context = {
    queues: {
        staticSegment: staticSegmentQueue
    }
}


/*
    Setup Sentry if enabled
 */
if (Config.get('/raven/enabled')) {
    const Raven = require('raven')
    Raven.config(Config.get('/raven/dsn'))
    context.raven = Raven
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


console.log("Initializing workers...")
Workers.init(context)
console.log("Done")