'use strict';


const RoverApis = require('@rover/apis')
const Client = RoverApis.notification.v1.Services.NotificationClient
const grpc = require('grpc')

const config = {
    host:
        process.env.NOTIFICATION_SERVICE_SERVICE_HOST ||
        process.env.NOTIFICATION_V1_SERVICE_HOST ||
        'localhost',
    port:
        process.env.NOTIFICATION_SERVICE_SERVICE_PORT ||
        process.env.NOTIFICATION_V1_SERVICE_PORT ||
        5100
}


module.exports.register = function(server, options, next) {
  
    const connection = `${config.host}:${config.port}`
    const client = new Client(connection, grpc.credentials.createInsecure())

    server.connections.notification = { client: client }

    return next()

};

module.exports.register.attributes = {
    name: 'notification',
};