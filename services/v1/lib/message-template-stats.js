'use strict';
const util = require('util');

const internals = {};

const collection = "message_template_stats";

internals.update = function(id, updates, callback) {
    const server = this;
    const mongodb = server.plugins.mongodb.client;
    const ObjectId = server.plugins.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [messageTemplateStats.update: ${id}] ` + util.inspect(updates, true, null, false));

    mongodb.collection(collection).updateOne({ _id: ObjectId(id) }, updates, function(err, response) {
        if (err) {
            return callback(err);
        }
        return callback(null, response);
    });
};

module.exports = {
    update: internals.update
}