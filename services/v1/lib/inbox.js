'use strict';
const util = require('util');
const keyPrefix = 'inbox_';
const internals = {};


internals.find = function(customer, args, callback) {
	const server = this;
	const redis = server.plugins.redis.client;
	const inboxKey = internals.getInboxKey(customer._id.toString());

	redis.lrange(inboxKey, 0, -1, (err, response) => {
		if (err) {
			return callback(err, null);
		}

		return callback(null, response);
	});
};

internals.addMessage = function(customer, message, callback) {
	const server = this;
	const redis = server.plugins.redis.client;
	const logger = server.plugins.logger.logger;
	const inboxKey = internals.getInboxKey(customer._id.toString());

	logger.debug('Service: [inbox.addMessage] ' + util.format("Key: %s %j", inboxKey, message));
	redis.lpush(inboxKey, message._id.toString(), (err, response) => {
		if (err) {
			return callback(err, null);
		}

		return callback(null, response);
	});
};

internals.deleteMessage = function(customer, messageId, callback) {
	const server = this;
	const redis = server.plugins.redis.client;
	const logger = server.plugins.logger.logger;
	const inboxKey = internals.getInboxKey(customer._id.toString());
	
	logger.debug('Service: [inbox.deleteMessage] ' + util.format("Key: %s %s", inboxKey, messageId));
	redis.lrem(inboxKey, 1, messageId, (err, response) => {
		if (err) {
			return callback(err, null);
		}

		return callback(null, response);
	});
};


// @private
internals.getInboxKey = (customerId) => {
	return keyPrefix + customerId
};


module.exports = {
	find: internals.find,
	addMessage: internals.addMessage,
	deleteMessage: internals.deleteMessage
}