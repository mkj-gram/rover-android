'use strict';

const util = require('util');






module.exports.register = function(server, options, next) {
    const logger = require('fluent-logger');
    
    logger.configure(null, {
       host: 'localhost',
       port: 24224,
       timeout: 3.0,
       reconnectInterval: 600000 // 10 minutes
    });

    server.expose('logger', logger);

    next();
};

module.exports.register.attributes = {
    name: 'fluentd',
};