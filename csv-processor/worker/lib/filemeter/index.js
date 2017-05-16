const Transform = require('stream').Transform
const util = require('util')
const EventEmitter = require('events').EventEmitter

function FileMeter() {
    if (!(this instanceof FileMeter)) return new FileMeter()

    Transform.call(this)
    EventEmitter.call(this)

    this.bytes = 0
}

util.inherits(FileMeter, EventEmitter)
util.inherits(FileMeter, Transform)

FileMeter.prototype._transform = function (chunk, encoding, cb) {
    this.bytes += chunk.length
    
    this.emit('bytesRead', chunk.length)
    this.push(chunk)
    cb()
}


module.exports = FileMeter