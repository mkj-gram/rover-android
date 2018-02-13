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

        methods.application.getCurrentDevice(request, function(err, device) {
            if (err) {
                return callback({ status: 400, message: "Failed to get current device" })
            }

            if (device === null || device === undefined) {
                return callback({ status: 422, message: "Failed to get current device" })
            }

            methods.message.find(messageId, { fields: ['message_template_id']}, function(err, message) {
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
