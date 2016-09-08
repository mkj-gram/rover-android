'use strict';
const util = require('util');
const moment = require('moment');
const internals = {};


// GET /v1/inbox
internals.get = function(request, reply) {
    // grab the current user
    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;

    logger.info('Started GET ' + request.path + ' for ' + request.info.remoteAddress);
    logger.info(request.params);

    methods.getCurrentCustomer(request, (err, customer) => {
        if (err) {
            return reply({status: 422, error: "Customer doesn't exist"}).code(422);
        }

        if (util.isNullOrUndefined(customer)) {
            return reply({ status: 404, error: "You must create and submit and event first before loading inbox"}).code(404);
        }

        const response = reply.entity({ modified: customer.inbox_updated_at.toUTCString() });
        
        if (response) {
            // Hapi has determined this should be a 304
            return;
        }
        
        methods.inbox.find(customer, {}, (err, messageIds) => {
            if (err) {
                return reply({status: 500, error: err});
            }

            if (messageIds.length == 0) {
                return reply({
                    data: [],
                    meta: {
                        'unread-messages-count': 0
                    }
                });
            }

            methods.message.findAll(messageIds, { excludeFields: ['landing_page'] }, (err, messages) => {
                if (err) {
                    return reply({ status: 500, error: err });
                }

                const data = messages.map(message => internals.serialize(message));
                
                data.reverse();

                let unreadMessageCount = 0;
                for ( var i = 0; i < messages.length ; i++ ) {
                    if (messages[i].read == false) {
                        unreadMessageCount++;
                    }
                }

                return reply({
                    data: data,
                    meta: {
                        'unread-messages-count': unreadMessageCount
                    }
                }).code(200);
            });
        });
        
    });
};



module.exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/v1/inbox',
        handler: internals.get,
        config: {
            cache: {
                expiresIn: 1,
                privacy: 'private'
            }
        }
    });
    next();
};

module.exports.register.attributes = {
    name: 'inbox-controller',
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