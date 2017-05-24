'use strict';

const internals = {};
const THRESHOLD_HOURS = 50400;

internals.getTag = function(event) {
    return `account_${event._account.id}.event`;
};

internals.capture = function(event) {
    const server = this;
    const fluentd = server.connections.fluentd.logger;
    const logger = server.plugins.logger.logger;

    let timestamp = event.utcUnixTimestamp();
    let tag = internals.getTag(event);
    let record = event.toRecord();

    if (timestamp > Math.floor(Date.now() / 1000) + THRESHOLD_HOURS ) {
        logger.warn("Event was generated too far in the future: " + tag);
        logger.warn(record);
        return;
    }

    logger.debug(`Service: [analytics.capture]: ${tag}`);
    logger.debug(JSON.stringify(record));
    fluentd.emit(tag, record, timestamp);
};

module.exports = {
    capture: internals.capture
}