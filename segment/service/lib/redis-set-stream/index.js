const Readable = require('stream').Readable
const util = require('util')

function RedisSetStream(client, key, chunkSize, opts) {
    if (!(this instanceof RedisSetStream)) return new RedisSetStream()

    this._client = client
    this._key = key
    this._chunkSize = chunkSize
    this._cursor = '0'
    this._finished = false

    opts.objectMode = true;
    opts.highWaterMark = 1
    Readable.call(this, opts)

}

util.inherits(RedisSetStream, Readable)

RedisSetStream.prototype._read = function() {
    let self = this

    if (self._finished == true) {
        return this.push(null)
    }

    console.log("SSCAN: " + self._key + " cursor: " + self._cursor + " chunkSize: " + self._chunkSize)
    self._client.sscan(self._key, self._cursor, 'COUNT', self._chunkSize, function(err, reply) {
        if (err) {
            self.push(null)
            return process.nextTick(function() { self.emit('error', err ) })
        }

        self._cursor = reply[0]
        const data = reply[1]

        if (self._cursor === '0') {
            self._finished = true
        }

        return self.push(data)
    })
};

module.exports = RedisSetStream

