'use strict';

const internals = {};


internals.getTag = function(event) {
	return `account_${event._account.id}.event`;
};

internals.capture = function(event) {
	const server = this;
	const fluentd = server.plugins.fluentd.logger;
	const logger = server.plugins.logger.logger;

	let tag = internals.getTag(event);

	logger.debug(`Service: [analytics.capture]: ${tag}`);
	fluentd.emit(tag, event.toRecord(), event.timestamp);
};

module.exports = {
	capture: internals.capture
}