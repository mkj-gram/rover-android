'use strict';

const util = require('util');
const moment = require('moment');

const internals = {};
const collection = 'customers';

internals.find = function(id) {
    return id;
};

internals.findByQuery = function(query, callback) {
    const server = this; 
    const mongodb = server.plugins.mongodb.client;
    const ObjectId = server.plugins.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [customer.findByQuery] \n' + util.inspect(query, true, null, false));
    mongodb.collection(collection).findOne(query, {}, function(err, doc) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, doc);
    });
};

internals.update = function(id, update, callback) {
    const server = this;
    const mongodb = server.plugins.mongodb.client;
    const ObjectId = server.plugins.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [customer.update] \n' + util.inspect(update, true, null, false));
    mongodb.collection(collection).updateOne({ _id: ObjectId(id) }, update, function(err, response) {
        if (err) {
            return callback(err);
        }

        return callback(null, response);
    });
};

// TODO
// rename this
internals.updateByDevice = function(id, deviceId, update, callback) {
    const server = this;
    const mongodb = server.plugins.mongodb.client;
    const ObjectId = server.plugins.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [customer.updateByDevice] \n' + util.inspect(update, true, null, false));
    mongodb.collection(collection).updateOne({ "_id": ObjectId(id), "devices._id": deviceId }, update, function(err, response) {
        if (err) {
            return callback(err);
        }

        return callback(null, response);
    });

};

internals.create = function(doc, callback) {
    const server = this;
    const mongodb = server.plugins.mongodb.client;
    const ObjectId = server.plugins.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    if (util.isNullOrUndefined(doc._id)) {
        doc._id = new ObjectId();
    }

    doc.document_bucket = internals.getRandomIntInclusive(1, 5);

    logger.debug('Service: [customer.create] \n' + util.inspect(doc, true, null, false));

    mongodb.collection(collection).insertOne(doc, function(err, response) {
        if (err) {
            return callback(err);
        }

        return callback(null, doc);
    });
};

internals.delete = function(customer, callback) {
    const server = this;
    const mongodb = server.plugins.mongodb.client;
    const ObjectId = server.plugins.mongodb.ObjectId;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [customer.delete] \n' + customer._id);

    mongodb.collection(collection).deleteOne({"_id": ObjectId(customer._id) }, (err, success) => {
        if (err) {
            return callback(err);
        }

        return callback(null, success);
    });
};

internals.pushDevice = function(customer, device, callback) {
    const server = this;

    customer.updated_at = moment.utc(new Date).toDate()
    
    let update = {"$set": { "updated_at":  customer.updated_at } , "$push": { "devices": device }}

    internals.update.bind(server)(customer._id, update, (err, success) => {
        if (err) {
            return callback(err);
        }

        let updatedCustomer = customer;
        
        if (util.isNullOrUndefined(updatedCustomer.devices)) {
            updatedCustomer.devices = [];
        }

        updatedCustomer.devices.push(device);

        return callback(null, updatedCustomer);
    });
};

internals.pullDevice = function(customer, device, callback) {
    const server = this;

    customer.updated_at = moment.utc(new Date).toDate()

    let update = { "$set": { "updated_at": customer.updated_at }, "$pull": { "devices": { "_id": device._id }}}
    internals.update.bind(server)(customer._id, update, (err, success) => {
        if (err) {
            return callback(err);
        }

        let updatedCustomer = customer;

        let indexOfRemovedDevice = customer.devices.findIndex((d) => { return d._id == device._id });

        if (indexOfRemovedDevice >= 0) {
            updatedCustomer.devices.splice(indexOfRemovedDevice, 1);
        }

        return callback(null, updatedCustomer);
    });
};

internals.index = function(customer, callback) {
    const server = this;
    // const elasticsearch = server.plugins.elasticsearch.client;
    const queue = server.plugins.elasticsearch.queue;
    const logger = server.plugins.logger.logger;

    let doc = internals.asIndexedJson(customer);

    logger.debug('Service: [customer.index] \n' + util.inspect(doc, true, null, false));
    
    queue.index({
        index: internals.getIndexForCustomer(customer),
        type: 'customer',
        id: customer._id.toString(),
        body: doc,
        version: moment.utc(customer.updated_at).valueOf() // Grabs unix time in milliseconds
    });

    return callback();
};

internals.deleteIndex = function(customer, callback) {
    const server = this;
    const elasticsearch = server.plugins.elasticsearch.client;
    const logger = server.plugins.logger.logger;

    logger.debug('Service: [customer.deleteIndex] id: ' + customer._id);
    
    elasticsearch.delete({
        index: internals.getIndexForCustomer(customer),
        type: 'customer',
        id: customer._id.toString()
    }, (err, response) => {
        if (err) {
            return callback(err);
        }

        return callback(null, response);
    });
};

internals.getIndexForCustomer = function(customer) {
    return "customers_account_" + customer.account_id;
};

internals.getRandomIntInclusive = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

internals.asIndexedJson = function(customer) {

    let devicesIndexedJson = (customer.devices || []).map((device) => internals.deviceAsIndexedJson(device));

    return {
        account_id: customer.account_id,
        identifier: customer.identifier,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone_number: customer.phone_number,
        tags: customer.tags,
        traits: customer.traits,
        age: customer.age,
        gender: customer.gender,
        document_bucket: customer.document_bucket,
        devices: devicesIndexedJson
    };

};

internals.deviceAsIndexedJson = function(device) {
    let json =  {
        _id: device._id,
        token: device.token,
        locale_lang: device.locale_lang,
        locale_region: device.locale_region,
        time_zone: device.time_zone,
        sdk_version: device.sdk_version,
        app_identifier: device.app_identifier,
        platform: device.platform,
        os_name: device.os_name,
        os_version: device.os_version,
        model: device.model,
        manufacturer: device.manufacturer,
        carrier: device.carrier,
        background_enabled: device.background_enabled,
        notifications_enabled: device.notifications_enabled,
        location_monitoring_enabled: device.location_monitoring_enabled,
        bluetooth_enabled: device.bluetooth_enabled,
        development: device.development
    }

    if (device.location && device.location.latitude && device.location.longitude) {
        json.location = {
            lat: device.location.latitude,
            lon: device.location.longitude
        }
    }

    return json;
};

module.exports = {
    find: internals.find,
    findByQuery: internals.findByQuery,
    update: internals.update,
    updateByDevice: internals.updateByDevice,
    create: internals.create,
    delete: internals.delete,
    pushDevice: internals.pushDevice,
    pullDevice: internals.pullDevice,
    index: internals.index,
    deleteIndex: internals.deleteIndex 
}