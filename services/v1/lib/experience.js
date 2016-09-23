'use strict';

const util = require('util');

const collection = 'experiences';

const internals = {};

internals.find = function(id, args, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [experience.find: ${id}] ` + util.inspect(args, true, null, false));

    let formattedArgs = {}

    if (!util.isNullOrUndefined(args.fields) && args.fields.length > 0) {
        args.fields.forEach(field  => {
            formattedArgs[field] = 1;
        });
    };

    if (!util.isNullOrUndefined(args.excludedFields) && args.excludedFields.length > 0) {
        args.excludedFields.forEach(field  => {
            formattedArgs[field] = 0;
        });
    };


    mongodb.collection(collection).findOne({ _id: ObjectId(id) }, formattedArgs, function(err, docs) {
        
        if (err) {
            return callback(err, null);
        }

        return callback(null, docs);
    });
};

module.exports = {
    find: internals.find
}