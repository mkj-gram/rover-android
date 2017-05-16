const util = require('util')
const EventEmitter = require('events').EventEmitter

/**
 * Given a stream make sure we are never processing more than maxMessages
 *
 * This also guarantees that `end` is only called when the whole stream was successfully processed
 * 
 * @param {Stream} stream GRPC Stream
 * @param {Object} opts   
 */
function BufferedStream(stream, opts) {
    if (!(this instanceof BufferedStream)) return new BufferedStream()

    EventEmitter.call(this)
    
    this._stream = stream

    const self = this

    const maxMessages = opts.maxMessages || 10

    let messagesInFlight = 0
    let hasFinishedStreaming = false
    let hasEmittedEnd = false
    let cancelled = false

    function finish() {
        if (messagesInFlight == 0 && hasFinishedStreaming == true && hasEmittedEnd == false && cancelled == false) {
            hasEmittedEnd = true
            self.emit('end')
        }
    }

    stream.on('cancelled', function() {
        cancelled = true
        self.emit('cancelled')
    })

    stream.on('data', function(message) {
        messagesInFlight += 1
        if (messagesInFlight > maxMessages) {
            stream.pause()
        }

       
        self.emit('data', message, function() {
            messagesInFlight -= 1;
            if (messagesInFlight <= maxMessages) {
                stream.resume()
            }

            process.nextTick(finish)
        })
        
    })

    stream.on('end', function() {
        hasFinishedStreaming = true
        process.nextTick(finish)
    })

    stream.on('error', function(err) {
        self.emit('error', err)
    })
}

util.inherits(BufferedStream, EventEmitter)

BufferedStream.prototype.pause = function() {
    this._stream.pause()
};

BufferedStream.prototype.resume = function() {
    this._stream.resume()
};


module.exports = BufferedStream