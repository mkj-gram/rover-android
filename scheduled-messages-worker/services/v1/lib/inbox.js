'use strict';
const util = require('util');
const keyPrefix = 'inbox_';
const internals = {};
const moment = require('moment')


internals.updateManyCacheKeys = function(customerIds, time, callback) {
    const server = this;
    const redis = server.connections.redis.client;
    const logger = server.plugins.logger.logger;

    const ids = customerIds.map(id => String(id))
    const unixTime = moment.utc(time).unix()

    let batch = redis.batch()

    ids.forEach(id => {
        const key = internals.getInboxUpdatedAtKey(id)
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
internals.getInboxKey = (customerId) => {
    return keyPrefix + customerId
};

internals.getInboxUpdatedAtKey = (customerId) => {
    return internals.getInboxKey(customerId).concat("_updated_at")
}


module.exports = {
   updateManyCacheKeys: internals.updateManyCacheKeys
}