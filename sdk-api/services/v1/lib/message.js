'use strict';

const util = require('util');
const dasherize = require('dasherize');

const collection = 'messages';

const internals = {};


internals.serialize = function(message, template) {
    if (template === undefined) {
        return undefined
    }
    
    return {
        id: message._id.toString(),
        notification_text: template.notification_text,
        ios_title: message.ios_title || template.ios_title || "",
        android_title: message.android_title || template.android_title || "",
        tags: template.tags || [],
        read: message.read,
        saved_to_inbox: message.saved_to_inbox,
        content_type: template.content_type,
        website_url: template.website_url,
        deep_link_url: template.deeplink_url,
        landing_page: dasherize(template.landing_page_template),
        experience_id: template.experience_id,
        properties: template.properties || {},
        timestamp: message.timestamp
    }
}

internals.isV1Id = function(id) {
    const server = this;
    const ObjectId = server.connections.mongodb.ObjectId;

    return ObjectId.isValid(id)
}

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
    isV1Id: internals.isV1Id,
    serialize: internals.serialize,
    find: internals.find,
    findAll: internals.findAll,
    update: internals.update,
    deleteOne: internals.deleteOne,
    bulkInsert: internals.bulkInsert
}



