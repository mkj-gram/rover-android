const util = require('util')
const Readable = require('stream').Readable

/*
	Helper method to scan all keys in redis from start to end
 */
function ScanStream(client, size, opts) {
    if (!(this instanceof ScanStream)) return new ScanStream()

    this._client = client
    this._size = size
    this._cursor = '0'
    this._match = opts.match || '*'
    this._finished = false

    opts.objectMode = true;
    opts.highWaterMark = 1
    Readable.call(this, opts)
}

util.inherits(ScanStream, Readable)

ScanStream.prototype._read = function() {
    let self = this

    if (self._finished == true) {
        return this.push(null)
    }

    // console.log("SCAN: match: " + self._match + " cursor: " + self._cursor + " size: " + self._size)
    self._client.scan(self._cursor, 'MATCH', self._match, 'COUNT', self._size, function(err, reply) {
        if (err) {
            self.push(null)
            return process.nextTick(function() { self.emit('error', err ) })
        }

        self._cursor = reply[0]
        const data = reply[1]

        if (self._cursor === '0') {
            self._finished = true
        }

        // self._finished = true

        return self.push(data)
    })
};

module.exports = ScanStream