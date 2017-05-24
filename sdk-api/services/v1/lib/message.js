'use strict';

const util = require('util');

const collection = 'messages';

const internals = {};



internals.find = function(id, args, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [message.find: ${id}] ` + util.inspect(args, true, null, false));

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

internals.findAll = function(ids, args, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [message.findAll: ${ids}] ` + util.inspect(args, true, null, false));
    // TODO
    // check to see if they are already objectids or not

    let objectIds = ids.map( id => ObjectId(id) );

    let formattedArgs = {}
    if (!util.isNullOrUndefined(args.excludedFields) && args.excludedFields.length > 0) {
        args.excludedFields.forEach(field  => {
            formattedArgs[field] = 0;
        });
    };

    mongodb.collection(collection).find({ _id: { $in: objectIds }}, formattedArgs).toArray(function(err, docs) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, docs);
    });
};

internals.update = function(id, updates, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [message.update: ${id}] ` + util.inspect(updates, true, null, false));

    mongodb.collection(collection).updateOne({ _id: ObjectId(id) }, updates, function(err, response) {
        if (err) {
            return callback(err);
        }
        return callback(null, response);
    });
};

internals.deleteOne = function(id, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [message.deleteOne: ${id} ]`);

    mongodb.collection(collection).deleteOne({ _id: ObjectId(id) }, function(err, response) {
        if (err) {
            return callback(err);
        }

        return callback(null, response);
    });
};

internals.bulkInsert = function(messages, callback) {
    const server = this;
    const mongodb = server.connections.mongodb.client;
    const ObjectId = server.connections.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug(`Service: [message.bulkInsert: ${messages.length} messages ]`);

    let bulk = mongodb.collection(collection).initializeUnorderedBulkOp();

    for (let i = 0; i < messages.length; i++) {
        bulk.insert(messages[i]);
    }

    if (bulk.length == 0) {
        return callback(null, messages);
    }   
    
    bulk.execute().then(result => {
        if (result.isOk) {
            return callback(null, messages);
        }

        return callback("Bulk Insert Failed");
    }).catch(err => {
        logger.error(err);
        return callback(err);
    });
};

module.exports = {
    find: internals.find,
    findAll: internals.findAll,
    update: internals.update,
    deleteOne: internals.deleteOne,
    bulkInsert: internals.bulkInsert
}



