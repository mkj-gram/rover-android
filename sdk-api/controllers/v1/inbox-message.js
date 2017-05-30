'use strict';

const Joi = require('joi');
const util = require('util');
const moment = require('moment');
const AllowedScopes = ['sdk'];
var dasherize = require('dasherize');
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
    
    const currentScopes = request.auth.context.scopes;

    if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
        return internals.writeError(reply, 403, { status: 403, error: "Insufficient permissions"})
    }

    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;
    const messageId = request.params.id;

    methods.application.getCurrentCustomer(request, (err, customer) => {
        if (err) {
            internals.writeError(reply, 500, { status: 500, error: "Failed to find customer"});
            return callback(err);
        }

        if (util.isNullOrUndefined(customer)) {
            internals.writeError(reply, 422, { status: 422, error: "Failed to find customer"});
            return callback(err);
        }
        
        methods.message.find(messageId, { fields: ['_id', 'customer_id', 'message_template_id'] }, (err, message) => {
            if (err) {
                internals.writeError(reply, 500, { status: 500, error: err });
                return callback(err);
            }

            if (message) {
                let templateId = message.message_template_id;

                methods.messageTemplate.find(templateId, { useCache: true }, (err, template) => {
                    if (err) {
                        internals.writeError(reply, 500, { status: 500, error: 'Cannot find message'});
                        return callback(err);
                    }

                    if (template && customer._id.equals(message.customer_id)) {
                        return callback(null, customer, message, template); 
                    } else {
                       internals.writeError(reply, 403, { status: 403, error: 'Cannot view message'});
                       return callback(err);
                    }
                });
            } else {
                internals.writeError(reply, 404, { status: 404, error: 'Message not found'});
                return callback("Not found");  
            }
        });
    });
};

// GET /v1/inbox/messages/:id
internals.get = function(request, reply) {

    internals.beforeFilter(request, reply, (err, customer, message, template) => {
        
        if (err) {
            // error was raised we shouldn't do anything
            return;
        }

        reply.writeHead(200, {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        });

        reply.write(JSON.stringify({
            data: internals.serialize(message, template)
        }));

        return reply.end();
    });
};


// UPDATE /v1/inbox/messages/:id
internals.update = function(request, reply) {

    const methods = request.server.methods;

    internals.beforeFilter(request, reply, (err, customer, message, template) => {
        
        if (err) {
            return;
        }

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
                            'Content-Type': 'application/json',
                            'Connection': 'keep-alive'
                        });
                        reply.write(JSON.stringify({
                            data: internals.serialize(message, template)
                        }));
                        return reply.end();
                    });
                });

            } else {
                reply.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                });
                reply.write(JSON.stringify({
                    data: internals.serialize(message, template)
                }));
                return reply.end();
            }
        });
    });
};

// DESTORY /v1/inbox/messages/:id
internals.destroy = function(request, reply) {

    const methods = request.server.methods;

    internals.beforeFilter(request, reply, (err, customer, message, template) => {

        if (err) {
            return;
        }

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

internals.serialize = function(message, template) {
    return {
        id: message._id.toString(),
        type: 'messages',
        attributes: {
            'notification-text': template.notification_text,
            'ios-title': message.ios_title || template.ios_title || "",
            'android-title': message.ios_title || template.android_title || "",
            'tags': template.tags || [],
            'read': message.read,
            'saved-to-inbox': message.saved_to_inbox,
            'content-type': template.content_type,
            'website-url': template.website_url,
            'deep-link-url': template.deeplink_url,
            'landing-page': dasherize(template.landing_page_template),
            'experience-id': template.experience_id,
            'properties': template.properties || {},
            'timestamp': moment.utc(message.timestamp).toISOString()
        }
    }
};

module.exports = {
    get: internals.get,
    update: internals.update,
    destroy: internals.destroy
}


