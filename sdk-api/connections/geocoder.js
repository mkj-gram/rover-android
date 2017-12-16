'use strict';

const GeocoderClient = require("@rover/geocoder-client")


module.exports.register = function(server, options, next) {
    
    const client = GeocoderClient.v1.Client()

    server.connections.geocoder = { client: client }

    return next()

};

module.exports.register.attributes = {
    name: 'geocoder',
};