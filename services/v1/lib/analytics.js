'use strict';

const internals = {};


internals.getTag = function(event) {
    return `account_${event._account.id}.event`;
};

internals.capture = function(event) {
    const server = this;
    const fluentd = server.connections.fluentd.logger;
    const logger = server.plugins.logger.logger;

    let tag = internals.getTag(event);
    let record = event.toRecord();

    logger.debug(`Service: [analytics.capture]: ${tag}`);
    logger.debug(JSON.stringify(record));
    fluentd.emit(tag, record, event.utcUnixTimestamp());
};

module.exports = {
    capture: internals.capture
}