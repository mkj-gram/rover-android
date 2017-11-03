const util = require('util')
const moment = require('moment')
const AllowedScopes = ['sdk', 'server']
var dasherize = require('dasherize')
const underscore = require('underscore')

const emptyInboxResponse = JSON.stringify({ data: [], meta: { 'unread-messages-count': 0 } });
const emptyInboxContentLength = Buffer.byteLength(emptyInboxResponse, "utf-8");


function serializeMessage(message, template) {
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
}

module.exports = function() {
    const handlers = {}

    function writeReplyError(reply, status, message) {
        reply.writeHead(status || 500, {
            'Content-Type': 'application/json'
        })
        reply.write(JSON.stringify(message))
        reply.end()
    }

    function isStale(request, lastModified) {
        if (lastModified === null || lastModified === undefined) {
            return true
        } else {
            lastModified = moment(lastModified).toDate().toUTCString();
        }
        let ifModifiedSince = request.headers['if-modified-since'];
        return ifModifiedSince !== lastModified;
    }

    handlers.get = function(request, reply) {
        const currentScopes = request.auth.context.scopes
        if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
            return writeReplyError(reply, 403, { status: 403, error: "Permission Denied" })
        }

        const methods = request.server.methods
        const logger = request.server.plugins.logger.logger

        methods.application.getCurrentDevice(request, function(err, device) {
            if (err) {
                logger.error(err)
                return writeReplyError(reply, 500, { status: 500, error: "Failed to get current device" })
            }

            if (device === null || device === undefined) {
                return writeReplyError(reply, 404, { status: 404, error: "device not found"})
            }

            methods.inbox.getLastModifiedAt(device, function(err, inboxUpdatedAt) {
                if (err) {
                    logger.error(err)
                    // its fine if we get an error we will just treat the request as non stale
                }
                
                if (!isStale(request, inboxUpdatedAt)) {
                    let headers = {
                        'Cache-Control': 'max-age=0, private, must-revalidate',
                        'Connection': 'keep-alive',
                        'Content-Length': 0
                    }

                    if (inboxUpdatedAt !== null && inboxUpdatedAt !== undefined) {
                        headers['Last-Modified'] = moment(inboxUpdatedAt).toDate().toUTCString()
                    }

                    reply.writeHead(304, headers);
                    return reply.end();
                }

                methods.inbox.find(device, function(err, messageIds) {
                    if (err) {
                        logger.error(err)
                        return writeReplyError(reply, 500, { status: 500, error: "Failed to get messages from inbox" })
                    }

                    if (messageIds.length === 0) {
                        reply.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Connection': 'keep-alive',
                            'Content-Length': emptyInboxContentLength
                        })
                        reply.write(emptyInboxResponse)
                        return reply.end()
                    }

                    methods.message.findAll(messageIds, {}, function(err, messages) {
                        if (err) {
                            logger.error(err)
                            return writeReplyError(reply, 500, { status: 500, error: "Failed to get messages from inbox" })
                        }

                        let templateIds = Array.from(new Set(messages.map(message => message.message_template_id)))

                        methods.messageTemplate.findAll(templateIds, { useCache: true }, (err, templates) => {
                            if (err) {
                                return writeReplyError(reply, 500, { status: 500, error: "Failed to get message templates from messages" })
                            }

                            let templateIndex = underscore.indexBy(templates, 'id');

                            const data = messages.map(message => {
                                let template = templateIndex[message.message_template_id];
                                return serializeMessage(message, template);
                            });

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
                            })

                            let headers = {
                                'Content-Type': 'application/json',
                                'Connection': 'keep-alive',
                                'Cache-Control': 'max-age=0, private, must-revalidate',
                                'Content-Length': Buffer.byteLength(response, "utf-8")
                            }

                            if (inboxUpdatedAt !== null && inboxUpdatedAt !== undefined) {
                                headers['Last-Modified'] = moment(inboxUpdatedAt).toDate().toUTCString()
                            }

                            reply.writeHead(200, headers);
                            reply.write(response);
                            return reply.end();

                        });
                    })
                })

            })
        })

    }


    return handlers
}