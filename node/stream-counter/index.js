const Transform = require('stream').Transform
const util = require('util')

function StreamCounter() {
    if (!(this instanceof StreamCounter)) return new StreamCounter()

    Transform.call(this)

    this.bytes = 0
}

util.inherits(StreamCounter, Transform)

StreamCounter.prototype._transform = function (chunk, encoding, cb) {
    this.bytes += chunk.length
    
    this.emit('bytesRead', chunk.length)
    this.push(chunk)
    cb()
}


module.exports = StreamCounter