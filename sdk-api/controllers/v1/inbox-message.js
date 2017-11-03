const dasherize = require('dasherize')
const Joi = require('joi')
const moment = require('moment')

const AllowedScopes = ['sdk', 'server']

const updateSchema = Joi.object().required().keys({
    data: Joi.object().required().keys({
        attributes: Joi.object().required().keys({
            read: Joi.boolean().optional()
        })
    })
})


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

    function before(request, callback) {
        const currentScopes = request.auth.context.scopes;

        if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
            return callback({ status: 403, error: "Insufficient permissions"})
        }

        const methods = request.server.methods;
        const logger = request.server.plugins.logger.logger;
        const messageId = request.params.id;

        methods.application.getCurrentDevice(request, function(err, device) {
            if (err) {
                return callback({ status: 400, message: "Failed to get current device" })
            }

            if (device === null || device === undefined) {
                return callback({ status: 422, message: "Failed to get current device" })
            }

            methods.message.find(messageId, { fields: ['_id', 'message_template_id', 'read']}, function(err, message) {
                if (err) {
                    return callback({ status: 500, message: "Failed to get current message" })
                }

                if (message === null || message === undefined) {
                    return callback({ status: 404, message: "Message not found" })
                }

                const templateId = message.message_template_id

                if (templateId === null || templateId === undefined) {
                    return callback({ status: 404, message: "Message template not found" })
                }

                methods.messageTemplate.find(templateId, { useCache: true }, function(err, template) {
                    if (err) {
                        return callback({ status: 500, message: "Failed to find message template" })
                    }

                    if (template === null || template === undefined) {
                        return callback({ status: 404, message: "Message template not found" })
                    }

                    return callback(null, device, message, template)
                })
            })
        })
    }

   

    handlers.get = function(request, reply) {
        const methods = request.server.methods;
        const logger = request.server.plugins.logger.logger;
        const messageId = request.params.id;

        before(request, function(err, device, message, template) {
            if (err) {
                logger.error(err)
                return writeReplyError(reply, err.status, { status: err.status, error: err.message })
            }

            let response = {
                data: serializeMessage(message, template)
            }

            reply.writeHead(200, {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            })

            reply.write(JSON.stringify(response))

            return reply.end()
        })
    }

    handlers.update = function(request, reply) {
        const methods = request.server.methods;
        const logger = request.server.plugins.logger.logger;
        const messageId = request.params.id;

        before(request, function(err, device, message, template) {
            if (err) {
                logger.error(err)
                return writeReplyError(reply, err.status, { status: err.status, error: err.message })
            }

            Joi.validate(request.payload, updateSchema, { stripUnknown: true }, function(err, value) {
                if (err) {
                    return writeReplyError(reply, 400, { status: 400, error: err.message})
                }

                const attributes = value.data.attributes

                if (attributes === null || attributes === undefined) {
                    return writeReplyError(reply, 400, { status: 400, error: "Missing attributes" })
                }

                let updates = {}

                Object.keys(attributes).forEach(function(key) {
                    if (message[key] != attributes[key]) {
                        updates[key] = attributes[key]
                        message[key] = attributes[key]
                    }
                })

                if (Object.keys(attributes).length === 0) {
                    let response = {
                        data: serializeMessage(message, template)
                    }

                    reply.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Connection': 'keep-alive'
                    })

                    reply.write(JSON.stringify(response))

                    return reply.end()
                }

                let currentTime = new Date()
                updates.updated_at = currentTime

                methods.message.update(message._id, {"$set": updates }, function(err, response) {
                    if (err) {
                        return writeReplyError(reply, 500, { status: 500, error: "Failed to update message" })
                    }

                    methods.inbox.updateLastModifiedAt(device, currentTime, function(err) {
                        if (err) {
                            logger.error(err)
                            return writeReplyError(reply, 500, { status: 500, error: "Failed to update inbox" })
                        }

                        let response = {
                            data: serializeMessage(message, template)
                        }

                        reply.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Connection': 'leep-alive'
                        })

                        reply.write(JSON.stringify(response))

                        return reply.end()
                    })
                })
            })
        })
    }

    handlers.destroy = function(request, reply) {
        const methods = request.server.methods;
        const logger = request.server.plugins.logger.logger;
        const messageId = request.params.id;

        before(request, function(err, device, message, template) {
            if (err) {
                return writeReplyError(reply, err.status, { status: err.status, error: err.message })
            }

            methods.message.deleteOne(message._id, function(err) {
                if (err) {
                    return writeReplyError(reply, 500, { status: 500, error: "Failed to delete message "});
                }
                
                methods.inbox.deleteMessage(device, message._id.toString(), function(err) {
                    if (err) {
                        return writeReplyError(reply, 500, { status: 500, error: "Failed to delete message "});
                    }

                    reply.writeHead(204, {})
                    return reply.end()

                })
            })
        })
    }

    return handlers
}
