'use strict';
const util = require('util');
const moment = require('moment');
var dasherize = require('dasherize');
const internals = {};

const emptyInboxResponse = JSON.stringify({ data: [], meta: { 'unread-messages-count': 0 } });
const emptyInboxContentLength = Buffer.byteLength(emptyInboxResponse, "utf-8");

internals.getLastModifiedAt = function(customer) {
    if (util.isNullOrUndefined(customer.inbox_updated_at)) {
        return undefined;
    } else {
        return moment(customer.inbox_updated_at).toDate().toUTCString();
    }
}

internals.isStale = function(request, lastModified) {
    if (util.isNullOrUndefined(lastModified)) {
        return true
    } else {
        lastModified = moment(lastModified).toDate().toUTCString();
    }
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
            reply.write(JSON.stringify({ errors: [ { message: "You must create and submit an event before loading the inbox" }]}));
            return reply.end();
        }


        if (internals.isStale(request, customer.inbox_updated_at)) {
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
                        'Content-Type': 'application/json',
                        'Connection': 'keep-alive',
                        'Content-Length': emptyInboxContentLength
                    });
                    reply.write(emptyInboxResponse);
                    return reply.end();
                }

                methods.message.findAll(messageIds, {}, (err, messages) => {
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

                    let response = JSON.stringify({
                        data: data,
                        meta: {
                            'unread-messages-count': unreadMessageCount
                        }
                    });

                    let headers = {
                        'Content-Type': 'application/json',
                        'Connection': 'keep-alive',
                        'Cache-Control': 'max-age=0, private, must-revalidate',
                        'Content-Length': Buffer.byteLength(response, "utf-8")
                    }

                    let lastModifiedAt = internals.getLastModifiedAt(customer);
                    if (!util.isNullOrUndefined(lastModifiedAt)) {
                        util._extend(headers, {
                            'Last-Modified': lastModifiedAt
                        });
                    }
                    reply.writeHead(200, headers);
                    reply.write(response);
                    return reply.end();
                });
            });
        } else {

            let headers = {
                'Cache-Control': 'max-age=0, private, must-revalidate',
                'Connection': 'keep-alive',
                'Content-Length': 0
            }

            let lastModifiedAt = internals.getLastModifiedAt(customer);
            if (!util.isNullOrUndefined(lastModifiedAt)) {
                util._extend(headers, {
                    'Last-Modified': lastModifiedAt
                });
            }

            reply.writeHead(304, headers);
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
            'landing-page': dasherize(message.landing_page),
            'experience-id': message.experience_id,
            'properties': message.properties || {},
            'timestamp': moment.utc(message.timestamp).toISOString()
        }
    }
};


module.exports = {
    get: internals.get
}