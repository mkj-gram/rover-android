'use strict';

const amqp = require('amqplib');

module.exports.register = function(server, options, next) {

    server.connections.rabbitmq = {};

    const logger = server.plugins.logger.logger;

    amqp.connect(options.url)
        .then(connection => connection.createChannel())
        .then(channel => {
            server.connections.rabbitmq.channel = channel;
            return next();
        })
        .catch(err => {
            logger.error(err);
            return next(err);
        });
    
};

module.exports.register.attributes = {
    name: 'rabbitmq',
};