'use strict';

// TODO: Remove this dependecy
var dasherize = require('dasherize');
const internals = {};


module.exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: '/v1/inbox/{messageId}/landing-page',
		handler: internals.get,
		config: {
			cache: {
				expiresIn: 31536000, // 365 days / 1 year
				privacy: 'private'
			}
		}
	});
	next();
};

module.exports.register.attributes = {
	name: 'inbox-landing-page-controller',
};


internals.get = function(request, reply) {
	// gets the individual landing-page
	// TODO
	// validate the messageId being passed in
	const methods = request.server.methods;
	const logger = request.server.plugins.logger.logger;
	const messageId = request.params.messageId;

	logger.info('Started GET ' + request.path + ' for ' + request.info.remoteAddress);
	logger.info(request.params);

	methods.getCurrentCustomer(request, (err, customer) => {
		methods.message.find(messageId, { fields: ['landing_page', 'customer_id']}, (err, message) => {
			// we are only requesting for the landing_page field to be set
			if (err) {
				return reply({ status: 404, error: 'message doesn\'t exist'}).code(404);
			}

			if ( customer._id.equals(message.customer_id) ){
				return reply(internals.serialize(message));
			} else {
				return reply({ status: 403, error: 'You do not have access to this message'}).code(403);
			}	
		});
	});
};

internals.serialize = function(message) {
	return dasherize(message.landing_page);
};