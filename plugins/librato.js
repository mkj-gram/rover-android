'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('[hapi]');
const Config = require('../config');


module.exports.register = function(server, opts, next) {
	const librato = require('librato-node');
    librato.configure({ email: Config.get('/librato/email'), token: Config.get('/librato/token'), prefix: Config.get('/librato/prefix')});
    librato.start();
    server.plugins.librato = {};
    server.plugins.librato.client =  librato;
    next();
};

module.exports.register.attributes = {
    name: 'librato'
};