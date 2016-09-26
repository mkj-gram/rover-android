'use strict';
const util = require('util');
const moment = require('moment');
const internals = {};


internals.isStale = function(request, lastModified) {
    let ifModifiedSince = request.headers['if-modified-since'];
    return ifModifiedSince !== lastModified;
};

// GET /v1/inbox
internals.get = function(request, reply) {
    // grab the current user
    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;

    methods.application.getCurrentCustomer(request, (err, customer) => {
        if (err) {
            reply.writeHead(422, {
                'Content-Type': 'application/json'
            });
            reply.write(JSON.stringify({ errors: [ { message: "Customer doesn't exist" }]}));
            return reply.end();
        }

        if (util.isNullOrUndefined(customer)) {
            reply.writeHead(404, {
                'Content-Type': 'application/json'
            });
            reply.write(JSON.stringify({ errors: [ { message: "You must create and submit and event first before loading inbox" }]}));
            return reply.end();
        }


        if (internals.isStale(request, customer.inbox_updated_at.toUTCString())) {
            methods.inbox.find(customer, {}, (err, messageIds) => {
                if (err) {
                    reply.writeHead(500, {
                        'Content-Type': 'application/json'   
                    });
                    reply.write(JSON.stringify(err));
                    return reply.end();
                }

                
                if (messageIds.length == 0) {
                    reply.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    reply.write(JSON.stringify({
                        data: [],
                        meta: {
                            'unread-messages-count': 0
                        }
                    }));
                    return reply.end();
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

                    reply.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Last-Modified': customer.inbox_updated_at.toUTCString()
                    });
                    reply.write(JSON.stringify({
                        data: data,
                        meta: {
                            'unread-messages-count': unreadMessageCount
                        }
                    }));
                    return reply.end();
                });
            });
        } else {
            reply.writeHead(304, {
                'Last-Modified': customer.inbox_updated_at.toUTCString()
            });
            return reply.end();
        }        
    });
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


module.exports = {
    get: internals.get
}