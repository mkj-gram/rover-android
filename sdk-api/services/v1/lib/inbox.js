'use strict';
const util = require('util');
const keyPrefix = 'inbox_';
const moment = require('moment')
const internals = {};


internals.find = function(customer, callback) {
    const server = this;
    const redis = server.connections.redis.client;
    const inboxKey = internals.getInboxKey(customer.id);

    redis.lrange(inboxKey, 0, -1, (err, response) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, response);
    });
};

internals.addMessage = function(customer, message, callback) {
    const server = this;
    const redis = server.connections.redis.client;
    const logger = server.plugins.logger.logger;
    const inboxKey = internals.getInboxKey(customer.id);
    const inboxUpdatedAtKey = internals.getInboxUpdatedAtKey(customer.id)

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

internals.deleteMessage = function(customer, messageId, callback) {
    const server = this;
    const redis = server.connections.redis.client;
    const logger = server.plugins.logger.logger;
    const inboxKey = internals.getInboxKey(customer.id);
    const inboxUpdatedAtKey = internals.getInboxUpdatedAtKey(customer.id)

    logger.debug('Service: [inbox.deleteMessage] ' + util.format("Key: %s %s", inboxKey, messageId));

    redis.multi()
        .lrem(inboxKey, 1, messageId)
        .set(inboxUpdatedAtKey, internals.getCurrentUnixTime())
        .exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            return callback(replies[0])
        })
};

internals.getCurrentUnixTime = function() {
    return moment.utc().unix()
}

internals.getLastModifiedAt = function(customer, callback) {
    const server = this
    const redis = server.connections.redis.client
    const logger = server.plugins.logger.logger
    const key = internals.getInboxUpdatedAtKey(customer.id)

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

internals.updateLastModifiedAt = function(customer, time, callback) {
    const server = this
    const redis = server.connections.redis.client
    const logger = server.plugins.logger.logger
    const key = internals.getInboxUpdatedAtKey(customer.id)

    const unixTime = moment(time).utc().unix()

    redis.set(key, unixTime, function(err, response) {
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
    find: internals.find,
    addMessage: internals.addMessage,
    deleteMessage: internals.deleteMessage,
    getLastModifiedAt: internals.getLastModifiedAt,
    updateLastModifiedAt: internals.updateLastModifiedAt
}