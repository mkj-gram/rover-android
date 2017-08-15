'use strict';

const AudienceClient = require("@rover/audience-client")


module.exports.register = function(server, options, next) {
    
    const client = AudienceClient.v1.Client()

    server.connections.audience = { client: client }

    return next()

};

module.exports.register.attributes = {
    name: 'audience',
};