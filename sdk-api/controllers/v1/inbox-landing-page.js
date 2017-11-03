const dasherize = require('dasherize')
const AllowedScopes = ['sdk', 'server']

module.exports = function() {
    const handlers = {}

    function serializeLandingPage(landing_page) {
        return dasherize(landing_page);
    }

    handlers.get = function(request, reply) {

        function writeReplyError(status, body) {
            let response = JSON.stringify(body)
            reply.writeHead(status, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(response, "utf-8")
            })
            reply.write(response)
            reply.end()
        }


        const currentScopes = request.auth.context.scopes

        if (!currentScopes.some(scope => AllowedScopes.includes(scope))) {
            return writeReplyError(403, { status: 403, error: "Insufficient Permissions" })
        }

        const methods = request.server.methods
        const logger = request.server.plugins.logger.logger
        const messageId = request.params.id

        methods.application.getCurrentProfile(request, function(err, profile) {
            if (err) {
                logger.error(err)
                return writeReplyError(500, { status: 500, error: "Could not get current profile"})
            }

            if (profile === null || profile === undefined) {
                return writeReplyError(400, { status: 400, error: "Profile does not exist" })
            }

            methods.message.find(messageId, { fields: ['message_template_id']}, function(err, message) {
                if (err) {
                    logger.error(err)
                    return writeReplyError(500, { status: 500, error: "Could not retrieve message" })
                }

                if (message === null || message === undefined) {
                    return writeReplyError(404, { status: 404, error: "Message not found" })
                }

                methods.messageTemplate.find(message.message_template_id, { useCache: true }, function(err, template) {
                    if (err) {
                        logger.error(err)
                        return writeReplyError(500, { status: 500, error: "Unable to lookup message template" })
                    }

                    if (template === null || template === undefined) {
                        return writeReplyError(404, { status: 404, error: "Message Template not found" })
                    }

                    let response = JSON.stringify(serializeLandingPage(template.landing_page_template))

                    reply.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Connection': 'keep-alive',
                        'Content-Length': Buffer.byteLength(response, 'utf-8')
                    })

                    reply.write(response)
                    return reply.end()
                })
            })
        })
    }


    return handlers
}
