'use strict';

const util = require('util');
const Config = require('../config');

module.exports.register = function(server, options, next) {
    const logger = require('fluent-logger').createFluentSender(null, {
        host: Config.get("/cruncher_buffer_client/host"),
        port: Config.get("/cruncher_buffer_client/port"),
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