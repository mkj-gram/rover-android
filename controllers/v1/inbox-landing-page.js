'use strict';

const util = require('util');
var dasherize = require('dasherize');
const internals = {};


internals.writeError = function(reply, status, message) {
    reply.writeHead(status, {
        'Content-Type': 'application/json'
    });
    reply.write(JSON.stringify(message));
    reply.end();
};

internals.get = function(request, reply) {
    // gets the individual landing-page
    // TODO
    // validate the messageId being passed in
    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;
    const messageId = request.params.id;

    methods.application.getCurrentCustomer(request, (err, customer) => {
        methods.message.find(messageId, { fields: ['customer_id', 'message_template_id']}, (err, message) => {
            // we are only requesting for the landing_page field to be set
            if (err) {
                return internals.writeError(reply, 400, { status: 404, error: 'message doesn\'t exist'});
            }

            if ( customer._id.equals(message.customer_id) ){
                methods.messageTemplate.find(message.message_template_id, { useCache: true }, (err, template) => {
                    if (util.isUndefined(template)) {
                        reply.writeHead(204);
                        return reply.end();
                    } else {
                        let response = JSON.stringify(internals.serialize(template));

                        reply.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Connection': 'keep-alive',
                            'Content-Length': Buffer.byteLength(response, "utf-8")
                        });
                        reply.write(response);
                        return reply.end();
                    } 
                });
            } else {
                return internals.writeError(reply, 403, { status: 403, error: 'You do not have access to this message'});
            }   
        });
    });
};

internals.serialize = function(template) {
    return dasherize(template.landing_page_template);
};


module.exports = {
    get: internals.get
}
