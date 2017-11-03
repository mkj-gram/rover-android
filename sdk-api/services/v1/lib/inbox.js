'use strict';
const util = require('util');
const keyPrefix = 'inbox_';
const moment = require('moment')
const internals = {};


internals.find = function(device, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const inboxKey = internals.getInboxKey(device);

    redis.lrange(inboxKey, 0, -1, (err, response) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, response);
    });
};

internals.addMessage = function(device, message, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const logger = server.plugins.logger.logger;
    const inboxKey = internals.getInboxKey(device);
    const inboxUpdatedAtKey = internals.getInboxUpdatedAtKey(device)

    logger.debug('Service: [inbox.addMessage] ' + util.format("Key: %s %j", inboxKey, message));

    redis.multi()
        .lpush(inboxKey, message._id.toString())
        .set(inboxUpdatedAtKey, internals.getCurrentUnixTime())
        .exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            return callback(null, replies[0])
        })
};

internals.deleteMessage = function(device, messageId, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const logger = server.plugins.logger.logger;
    const inboxKey = internals.getInboxKey(device);
    const inboxUpdatedAtKey = internals.getInboxUpdatedAtKey(device)

    logger.debug('Service: [inbox.deleteMessage] ' + util.format("Key: %s %s", inboxKey, messageId));

    redis.multi()
        .lrem(inboxKey, 1, messageId)
        .set(inboxUpdatedAtKey, internals.getCurrentUnixTime())
        .exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            return callback(null, replies[0])
        })
};

internals.getCurrentUnixTime = function() {
    return moment.utc().unix()
}

internals.getLastModifiedAt = function(device, callback) {
    const server = this
    const redis = server.connections.redis.inbox.client
    const logger = server.plugins.logger.logger
    const key = internals.getInboxUpdatedAtKey(device)

    redis.get(key, function(err, response) {
        if (err) {
            return callback(err)
        }

        if (response === null) {
            return callback(null, null)
        }

        const date = moment.unix(response).toDate()
        return callback(null, date)
    })
}

internals.updateLastModifiedAt = function(device, time, callback) {
    const server = this
    const redis = server.connections.redis.inbox.client
    const logger = server.plugins.logger.logger
    const key = internals.getInboxUpdatedAtKey(device)

    const unixTime = moment(time).utc().unix()

    redis.set(key, unixTime, function(err, response) {
        if (err) {
            return callback(err)
        }

        return callback()
    })
}


// @private
internals.getInboxKey = (device) => {
    return `${device.account_id}:${device.id}`
};

internals.getInboxUpdatedAtKey = (device) => {
    return internals.getInboxKey(device).concat("_updated_at")
}


module.exports = {
    find: internals.find,
    addMessage: internals.addMessage,
    deleteMessage: internals.deleteMessage,
    getLastModifiedAt: internals.getLastModifiedAt,
    updateLastModifiedAt: internals.updateLastModifiedAt
}