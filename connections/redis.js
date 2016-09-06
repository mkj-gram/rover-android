'use strict';

const Joi = require('joi');
const redis = require('redis');

const redisConfigSchema = Joi.object().keys({
	url: Joi.string()
});

module.exports.register = function(server, options, next) {

	Joi.validate(options, redisConfigSchema, (err, value) => {
		if (err) {
			next(err);
		}
		const redisClient = redis.createClient(options);
		const logger = server.plugins.logger.logger;

		redisClient.on('error', (err) => {
			logger.warn('Redis ERROR: ');
			logger.warn(err);
		});

		server.expose('client', redisClient);

		next();
	});
};

module.exports.register.attributes = {
	name: 'redis',
};