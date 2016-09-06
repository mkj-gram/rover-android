'use strict';

const Hoek = require('hoek');
const Boom = require('boom');

const internals = {};


module.exports.register = function(server, options, next) {
	server.auth.scheme('rover-api-auth', internals.implementation);
	next();
};

module.exports.register.attributes = {
	name: 'rover-api-auth',
};

internals.implementation = function(server, options) {
	Hoek.assert(options, 'Missing rover-api-auth strategy options');
	Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in rover-api-auth scheme');

	const settings = Hoek.clone(options);

	const scheme = {
		authenticate: function(request, reply) {

			const req = request.raw.req;
			const authorization = req.headers['x-rover-api-key'];

			if (!authorization) {
				return reply(Boom.unauthorized('API key missing'));
			}

			settings.validateFunc(request, authorization, (err, isValid, credentials) => {

				credentials = credentials || null;

				if (err) {
					return reply(err, null, {
						credentials: credentials
					});
				}

				if (!isValid) {
					return reply(Boom.unauthorized('Unknown API token'), null, {
						credentials: credentials
					});
				}

				if (!credentials ||
					typeof credentials !== 'object') {

					return reply(Boom.badImplementation('Bad credentials object received for Rover Api auth validation'));
				}

				// Authenticated

				return reply.continue({
					credentials: credentials
				});
			});
		}
	};
	return scheme;
};