'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('[hapi]');
logger.setLevel("DEBUG");

module.exports.register = function(server, opts, next) {
    server.expose('logger', logger);
    next();
};

module.exports.register.attributes = {
    name: 'logger'
};