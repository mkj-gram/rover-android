const util = require('util')

function RedisBatchRead(client, key, chunkSize, cursor, opts) {
    if (!(this instanceof RedisBatchRead)) return new RedisBatchRead()

    this._client = client
    this._key = key
    this._chunkSize = chunkSize
    this._cursor = cursor === "" ? '0' : cursor
}


RedisBatchRead.prototype.read = function(callback) {
    let self = this

    console.log("SSCAN: " + self._key + " cursor: " + self._cursor + " chunkSize: " + self._chunkSize)
    self._client.sscan(self._key, self._cursor, 'COUNT', self._chunkSize, function(err, reply) {
        if (err) {
            return process.nextTick(function() { return callback(err) })
        }

        // cursor of '0' means we have reached the end
        const nextCursor = reply[0] === '0' ? null : reply[0]
        const data = reply[1]

        return process.nextTick(function() {
            return callback(null, data, nextCursor)
        })
    })
};

module.exports = RedisBatchRead

