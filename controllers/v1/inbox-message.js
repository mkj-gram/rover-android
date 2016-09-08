'use strict';

const Joi = require('joi');
const util = require('util');
const moment = require('moment');
const internals = {};


internals.beforeFilter = function(request, reply, callback) {
	const methods = request.server.methods;
	const logger = request.server.plugins.logger.logger;
	const messageId = request.params.id;

	logger.info('Started ' + request.method + ' ' + request.path + ' for ' + request.info.remoteAddress);
	logger.info(request.params);

	methods.getCurrentCustomer(request, (err, customer) => {
		if (err) {
			return reply({ status: 500, error: "Failed to find customer"}).code(500);
		}

		if (util.isNullOrUndefined(customer)) {
			return reply({ status: 422, error: "Failed to find customer"}).code(422);
		}
		
		methods.message.find(messageId, { excludedFields: ['landing_page'] }, (err, message) => {
			if (err) {
				return reply({ status: 500, error: err });
			}

			if (message) {
				if (customer._id.equals(message.customer_id)) {
					return callback(customer, message);	
				} else {
					return reply({ status: 403, error: 'Cannot view message'}).code(403);
				}
			}

			return reply({ status: 404, error: 'Message not found'}).code(404); 
		});
	});
};

// GET /v1/inbox/messages/:id
internals.get = function(request, reply) {

	internals.beforeFilter(request, reply, (customer, message) => {
		return reply({ data: internals.serialize(message) });
	});

};


// UPDATE /v1/inbox/messages/:id
internals.update = function(request, reply) {

	const methods = request.server.methods;

	internals.beforeFilter(request, reply, (customer, message) => {
		const server = request.server;
		const methods = server.methods;
		const attributes = request.payload.data.attributes;

		// detect the difference in attributes
		let updates = {};

		Object.keys(attributes).forEach((key) => {
			if (message[key] != attributes[key]) {
				updates[key] = attributes[key];
				message[key] = attributes[key];
			}
		});

		if (Object.keys(updates).length > 0) {
			let currentTime = moment.utc(new Date).toDate();
			updates = util._extend(updates, { updated_at: currentTime });
			methods.message.update(message._id, { "$set": updates }, (err, response) => {
				if (err) {
					return reply({ status: 500, error: "Failed to update message"}).code(500);
				}

				methods.customer.update(customer._id, { "$set": { inbox_updated_at: currentTime }}, (err, response) => {
					if (err) {
						return reply({ status: 500, error: "Failed to inbox cache key"}).code(500);
					}

					return reply({ data: internals.serialize(message) });
				});
			});

		} else {
			reply({ data: internals.serialize(message) });
		}
	});
};

// DESTORY /v1/inbox/messages/:id
internals.destroy = function(request, reply) {

	const methods = request.server.methods;

	internals.beforeFilter(request, reply, (customer, message) => {
		methods.message.deleteOne(message._id, (err) => {
			if (err) {
				return reply({ status: 500, error: "Failed to delete message "});
			}

			methods.inbox.deleteMessage(customer, message._id.toString(), (err) => {
				if (err) {
					return reply({ status: 500, error: "Failed to delete message "});
				}

				methods.customer.update(customer._id, { "$set": { "inbox_updated_at": moment.utc(new Date).toDate() }}, (err) => {
					if (err) {
						return reply({ status: 500, error: "Failed to update inbox cache"});
					}

					return reply().code(204);
				});
			});
		});
	});
};


module.exports.register = function(server, options, next) {

	const messageIdSchema = {
		params: {
            id: Joi.string().hex().length(24).required()
        }
	};

	const updateMessageSchema = {
		payload: {
			data: Joi.object().keys({
				type: Joi.string().equal('messages'),
				id: Joi.string(),
				attributes: Joi.object().keys({
					read: Joi.boolean().optional()
				})
			})
		}
	};

	server.route({
		method: 'GET',
		path: '/v1/inbox/messages/{id}',
		handler: internals.get,
		config: {
        	validate: messageIdSchema
	    }
	});

	server.route({
		method: 'GET',
		path: '/v1/inbox/{id}',
		handler: internals.get,
		config: {
        	validate: messageIdSchema
	    }
	});

	server.route({
		method: 'PATCH',
		path: '/v1/inbox/messages/{id}',
		handler: internals.update,
		config: {
			validate: util._extend(updateMessageSchema, messageIdSchema)
		}
	});

	server.route({
		method: 'PATCH',
		path: '/v1/inbox/{id}',
		handler: internals.update,
		config: {
			validate: util._extend(updateMessageSchema, messageIdSchema)
		}
	});

	server.route({
		method: 'DELETE',
		path: '/v1/inbox/messages/{id}',
		handler: internals.destroy,
		config: {
			validate: messageIdSchema
		}
	});

	server.route({
		method: 'DELETE',
		path: '/v1/inbox/{id}',
		handler: internals.destroy,
		config: {
			validate: messageIdSchema
		}
	});

	next();
};

module.exports.register.attributes = {
	name: 'inbox-message-controller',
};

internals.serialize = function(message) {
	return {
		id: message._id.toString(),
		type: 'messages',
		attributes: {
			'notification-text': message.notification_text,
			'ios-title': message.ios_title,
			'android-title': message.android_title,
			'tags': message.tags,
			'read': message.read,
			'saved-to-inbox': message.saved_to_inbox,
			'content-type': message.content_type,
			'website-url': message.website_url,
			'deep-link-url': message.deeplink_url,
			'landing-page': null, // we always render null so that the sdk is able to grab and render the inbox quickly
			'experience-id': message.experience_id,
			'properties': message.properties || {},
			'timestamp': moment.utc(message.timestamp).toISOString()
		}
	}
};


