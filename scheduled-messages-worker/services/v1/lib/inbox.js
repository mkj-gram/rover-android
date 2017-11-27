'use strict';
const util = require('util');
const keyPrefix = 'inbox_';
const internals = {};
const moment = require('moment')


internals.updateManyCacheKeys = function(accountId, deviceIds, time, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const logger = server.plugins.logger.logger;

    const ids = deviceIds.map(id => String(id))
    const unixTime = moment.utc(time).unix()

    let batch = redis.batch()

    ids.forEach(id => {
        const key = internals.getInboxUpdatedAtKey(accountId, id)
        batch.set(key, unixTime)
    })

    batch.exec(function(err, replies) {
        if (err) {
            return callback(err)
        }

        return callback()
    })
}


// @private
internals.getInboxKey = (accountId, deviceId) => {
    return `${accountId}:${deviceId}`
};

internals.getInboxUpdatedAtKey = (accountId, deviceId) => {
    return internals.getInboxKey(accountId, deviceId).concat("_updated_at")
}


module.exports = {
   updateManyCacheKeys: internals.updateManyCacheKeys
}
