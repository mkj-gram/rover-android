'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('[hapi]');
const Config = require('../config');

logger.setLevel(Config.get('/log/level'));

module.exports.register = function(server, opts, next) {
    server.expose('logger', logger);
    next();
};

module.exports.register.attributes = {
    name: 'logger'
};