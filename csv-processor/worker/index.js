const Queue = require('bull')
const Config = require('./config')
const Workers = require('./workers')


var staticSegmentQueue = Queue('static-segments', Config.get('/redis/url'));

const context = {
    queues: {
        staticSegment: staticSegmentQueue
    }
}



console.log("Initializing workers...")
Workers.init(context)
console.log("Done")


