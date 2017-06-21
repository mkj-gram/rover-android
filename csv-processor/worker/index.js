const Queue = require('bull')
const Config = require('./config')
const Workers = require('./workers')


// How long the job should be locked for until it is considered stalled
// We add 10 seconds ontop of timeout to let bull / node process the stalled job
const lockDuration = Config.get('/job/timeout') + 10000
// How often the job should renew its lock while its processing
const lockRenewTime = lockDuration / 2
// How often to look for jobs that have stalled. This call is very cpu intensive on redis
const stalledInterval = lockDuration

const queueOpts = {
    lockDuration: lockDuration,
    lockRenewTime: lockRenewTime,
    stalledInterval: stalledInterval
}

const staticSegmentQueue = Queue('static-segments', Config.get('/redis/url'), queueOpts);

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
    Raven.config(Config.get('/raven/dsn')).install()
    context.raven = Raven
}


console.log("Initializing workers...")
Workers.init(context)
console.log("Done")


