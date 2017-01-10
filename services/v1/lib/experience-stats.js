'use strict';
const util = require('util');

const internals = {};

const collection = "experience_stats";

internals.update = function(id, updates, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [experienceStats.update: ${id}] ` + util.inspect(updates, true, null, false));

    mongodb.collection(collection).updateOne({ _id: ObjectId(id) }, updates, function(err, response) {
        if (err) {
            return callback(err);
        }
        return callback(null, response);
    });
};

internals.incrementCounter = function(id, counter, incrementBy, callback) {
    const server = this;

    const update = { "$inc": {} };
    update["$inc"][counter] = incrementBy;

    return server.methods.experienceStats.update(id, update, callback);
};

module.exports = {
    update: internals.update
    incrementCounter: internals.incrementCounter
}