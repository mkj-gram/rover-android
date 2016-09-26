'use strict';

const Joi = require('joi');
const util = require('util');
const moment = require('moment');
const internals = {};

const updateSchema = Joi.object().required().keys({
    data: Joi.object().required().keys({
        attributes: Joi.object().required().keys({
            read: Joi.boolean().optional()
        })
    })
});

internals.writeError = function(reply, status, message) {
    reply.writeHead(status, {
        'Content-Type': 'application/json'
    });
    reply.write(JSON.stringify(message));
    reply.end();
};

internals.beforeFilter = function(request, reply, callback) {
    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;
    const messageId = request.params.id;

    methods.application.getCurrentCustomer(request, (err, customer) => {
        if (err) {
            return internals.writeError(reply, 500, { status: 500, error: "Failed to find customer"});
        }

        if (util.isNullOrUndefined(customer)) {
            return internals.writeError(reply, 422, { status: 422, error: "Failed to find customer"});
        }
        
        methods.message.find(messageId, { excludedFields: ['landing_page'] }, (err, message) => {
            if (err) {
                return internals.writeError(reply, 500, { status: 500, error: err });
            }

            if (message) {
                if (customer._id.equals(message.customer_id)) {
                    return callback(customer, message); 
                } else {
                   return internals.writeError(reply, 403, { status: 403, error: 'Cannot view message'});
                }
            }

            return internals.writeError(reply, 404, { status: 404, error: 'Message not found'})
        });
    });
};

// GET /v1/inbox/messages/:id
internals.get = function(request, reply) {

    internals.beforeFilter(request, reply, (customer, message) => {
        reply.writeHead(200, {
            'Content-Type': 'application/json'
        });

        reply.write(JSON.stringify({
            data: internals.serialize(message)
        }));

        return reply.end();
    });
};


// UPDATE /v1/inbox/messages/:id
internals.update = function(request, reply) {

    const methods = request.server.methods;

    internals.beforeFilter(request, reply, (customer, message) => {
        const server = request.server;
        const methods = server.methods;

        Joi.validate(request.payload, updateSchema, { stripUnknown: true }, (err, value) => {
            if (err) {
                return internals.writeError(reply, 400, { status: 400, error: err });
            }

            const attributes = value.data.attributes;

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
                        return internals.writeError(reply, 500, { status: 500, error: "Failed to update message"});
                    }

                    methods.customer.update(customer._id, { "$set": { inbox_updated_at: currentTime }}, (err, response) => {
                        if (err) {
                            return internals.writeError(reply, 500, { status: 500, error: "Failed to update inbox cache key"});
                        }
                        reply.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        reply.write(JSON.stringify({
                            data: internals.serialize(message)
                        }));
                        return reply.end();
                    });
                });

            } else {
                reply.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                reply.write(JSON.stringify({
                    data: internals.serialize(message)
                }));
                return reply.end();
            }
        });
    });
};

// DESTORY /v1/inbox/messages/:id
internals.destroy = function(request, reply) {

    const methods = request.server.methods;

    internals.beforeFilter(request, reply, (customer, message) => {
        methods.message.deleteOne(message._id, (err) => {
            if (err) {
                return internals.writeError(reply, 500, { status: 500, error: "Failed to delete message "});
            }

            methods.inbox.deleteMessage(customer, message._id.toString(), (err) => {
                if (err) {
                    return internals.writeError(reply, 500, { status: 500, error: "Failed to delete message "});
                }

                methods.customer.update(customer._id, { "$set": { "inbox_updated_at": moment.utc(new Date).toDate() }}, (err) => {
                    if (err) {
                        return internals.writeError(reply, 500, { status: 500, error: "Failed to update inbox cache"});
                    }
                    reply.writeHead(204, {});
                    return reply.end();
                });
            });
        });
    });
};

module.exports = {
    get: internals.get,
    update: internals.update,
    destroy: internals.destroy
}

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


