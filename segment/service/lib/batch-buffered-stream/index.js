const util = require('util')
const EventEmitter = require('events').EventEmitter
const BufferedStream = require('../buffered-stream')

function BatchBufferedStream(stream, opts) {
    if (!(this instanceof BatchBufferedStream)) return new BatchBufferedStream()

    EventEmitter.call(this)
    
    this._streamCancelled = false
    this._batchesInProcess = 0

    const self = this

    if (util.isNullOrUndefined(opts)) {
        opts = {}
    }

    const batchSize = opts.batchSize || 100

    const maxBatchesProcessing = 2
    
    let hasStreamEnded = false
    let currentBatch = new Array(batchSize)
    let currentBatchCallbacks = new Array(batchSize)
    let currentBatchIndex = 0
    let hasEmittedEnd = false

    function finish() {
        if (self._batchesInProcess == 0 && hasStreamEnded == true && hasEmittedEnd == false && self._streamCancelled == false) {
            hasEmittedEnd = true
            self.emit('end')
        }
    }

    stream.on('data', function(data) {

        currentBatch[currentBatchIndex] = data
        currentBatchIndex += 1

        if (currentBatchIndex >= batchSize) {

            self.emitNewBatch(currentBatch, currentBatchIndex, function() {
                stream.resume()
                process.nextTick(finish)

            })

            if (self._batchesInProcess >= maxBatchesProcessing) {
                stream.pause()
            }

            currentBatch = new Array(batchSize)
            currentBatchCallbacks = new Array(batchSize)
            currentBatchIndex = 0
        }

    })

    stream.on('end', function() {
        hasStreamEnded = true
        if (currentBatchIndex != 0) {
            self.emitNewBatch(currentBatch, currentBatchIndex, function() {
                process.nextTick(finish)
            })
        }
    })

    stream.on('cancelled', function() {
        self._streamCancelled = true
        self.emit('cancelled')
    })

    stream.on('error', function(err) {
        self.emit('error')
    })
}

util.inherits(BatchBufferedStream, EventEmitter)

BatchBufferedStream.prototype.emitNewBatch = function(batch, lastIndex, done) {

    if (this._streamCancelled == true) {
        return
    }

    let self = this

    self._batchesInProcess += 1

    let emittedBatch = batch.slice(0, lastIndex)

    self.emit('data', emittedBatch, function() {
        self._batchesInProcess -= 1
        if (util.isFunction(done)) {
            done()
        }
    })
};

module.exports = BatchBufferedStream