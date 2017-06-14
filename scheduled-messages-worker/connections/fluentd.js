'use strict';

const util = require('util');

module.exports.register = function(server, options, next) {
    const logger = require('fluent-logger').createFluentSender(null, {
        host: '127.0.0.1',
        port: 24284,
        timeout: 3.0,
        reconnectInterval: 600000 // 10 minutes
    });
    
    server.connections.fluentd = {};
    server.connections.fluentd.logger = logger;
    
    next();
};

module.exports.register.attributes = {
    name: 'fluentd',
};