'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('[api]');
const Config = require('../config');

logger.setLevel(Config.get('/log/level'));

module.exports.register = function(server, opts, next) {
	server.plugins.logger = {};
    server.plugins.logger.logger = logger;
    next();
};