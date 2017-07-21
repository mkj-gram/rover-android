'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('[hapi]');
const Config = require('../config');


module.exports.register = function(server, opts, next) {
	const librato = require('librato-node');
	const highResolutionLibrato = require('librato-node');

    librato.configure({ email: Config.get('/librato/email'), token: Config.get('/librato/token'), prefix: Config.get('/librato/prefix')});
    librato.start();

    librato.on('error', function(err) {
        console.error("Librato Error", err)
    })

    highResolutionLibrato.configure({ email: Config.get('/librato/email'), token: Config.get('/librato/token'), prefix: Config.get('/librato/prefix'), period: 2500});
    highResolutionLibrato.start();

    highResolutionLibrato.on('error', function(err) {
        console.error("Librato Error", err)
    })

    server.plugins.librato = {};
    server.plugins.librato.client = librato;
    server.plugins.librato.highResolutionClient = highResolutionLibrato;
    
    next();
};

module.exports.register.attributes = {
    name: 'librato'
};