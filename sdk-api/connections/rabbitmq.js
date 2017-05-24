'use strict';

const Joi = require('joi');
const amqp = require('amqplib');

const rabbitmqConfigSchema = Joi.object().keys({
    url: Joi.string()
});

module.exports.register = function(server, options, next) {

    server.connections.rabbitmq = {};

    Joi.validate(options, rabbitmqConfigSchema, (err, value) => {
        if (err) {
            next(err);
        }
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
    });
};

module.exports.register.attributes = {
    name: 'rabbitmq',
};