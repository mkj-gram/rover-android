const util = require('util')
const moment = require('moment')
const AllowedScopes = ['sdk', 'server']
var dasherize = require('dasherize')
const underscore = require('underscore')

function serializeMessage(message) {
    return {
        id: message.id,
        type: 'messages',
        attributes: {
            'notification-text': message.notification_text,
            'ios-title': message.ios_title || "",
            'android-title': message.ios_title || "",
            'tags': message.tags || [],
            'read': message.read,
            'saved-to-inbox': message.saved_to_inbox,
            'content-type': message.content_type,
            'website-url': message.website_url,
            'deep-link-url': message.deep_link_url,
            'landing-page': dasherize(message.landing_page_template),
            'experience-id': message.experience_id,
            'properties': message.properties || {},
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


            methods.inbox.fetch(device, function(err, messages) {
                if (err) {
                    logger.error(err)
                    return writeReplyError(reply, 500, { status: 500, error: "Failed to get messages from inbox"})
                }

                const data = messages.map(serializeMessage)
                const unreadCount = messages.reduce(function(acc, m) { 
                    return (acc + (m.read === false ? 1 : 0))
                }, 0)

                const response = JSON.stringify({
                    data: data,
                    meta: {
                        'unread-messages-count': unreadCount
                    }
                })

                const headers = {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'max-age=0, private, must-revalidate',
                    'Content-Length': Buffer.byteLength(response, "utf-8")
                }

                reply.writeHead(200, headers);
                reply.write(response);
                return reply.end();
            })
        })
    }


    return handlers
}