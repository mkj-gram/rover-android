'use strict';
var Promise = require('bluebird');
var _ = require('underscore');
const util = require('util');
const ISO3611 = require('../../lib/iso-3611');
const moment = require('moment');
const async = require('async');
const Joi = require('joi');
const Event = require('../../lib/event');
const VersionRegex = /\d+\.\d+\.\d+$|\d+\.\d+$/;

const Type = {
    STRING: 0,
    INTEGER: 1,
    BOOLEAN: 2
};

const customerPayloadKeys = new Set([
    'account-id', 
    'identifier', 
    'tags', 
    'first-name', 
    'last-name', 
    'email', 
    'gender', 
    'phone-number', 
    'age', 
    'traits'
]);

const devicePayloadKeys = new Set([
    'token',
    'locale-lang',
    'locale-region',
    'time-zone',
    'sdk-version',
    'platform',
    'os-name',
    'os-version',
    'model',
    'manufacturer',
    'carrier',
    'app-identifier',
    'background-enabled',
    'remote-notifications-enabled',
    'notifications-enabled',
    'location-monitoring-enabled',
    'bluetooth-enabled',
    'development',
    'aid'
]);
const internals = {};

internals.writeError = function(reply, status, message) {
    let response = JSON.stringify(message);
    reply.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(response, "utf-8")
    });
    
    console.error(response);
    reply.write(response);
    reply.end();
};

internals.dig = function(obj, ...keys) {
    let result = obj;
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        result = result[key];
        if (util.isNullOrUndefined(result)) {
            return undefined;
        }
    }
    return result;
};

internals.compareArrays = (arr1, arr2) => {

    if(arr1.length !== arr2.length) {
        return false;
    }

    arr1.sort();
    arr2.sort();
    
   for (var i = arr1.length - 1; i >= 0; i--) {
        if(arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

internals.customerDifferences = function(fromCustomer, toCustomer) {
    let customerUpdates = {};

    Object.keys(fromCustomer).forEach(key => {
        if (key != 'devices' && key != '_id' && key != 'updated_at' && key != 'created_at') {
            if (util.isArray(fromCustomer[key]) && util.isArray(toCustomer[key])) {
                // if in if because we don't want the next else if to run
                if (!_.isEqual(fromCustomer[key], toCustomer[key])) {
                    customerUpdates[key] = toCustomer[key];
                }
            } else if (fromCustomer[key] instanceof Date && toCustomer[key] instanceof Date) {
                if (fromCustomer[key].getTime() != toCustomer[key].getTime()) {
                    customerUpdates[key] = toCustomer[key];
                }
            } else if (!util.isUndefined(toCustomer[key]) && fromCustomer[key] != toCustomer[key]) {
                customerUpdates[key] = toCustomer[key];
            }  
        }
    });

    Object.keys(toCustomer).forEach(key => {
        if (util.isUndefined(fromCustomer[key]) && !util.isUndefined(toCustomer[key])) {
            customerUpdates[key] = toCustomer[key];
        }
    });

    return customerUpdates;
};

internals.deviceDifferences = function (fromDevice, toDevice) {

    let deviceUpdates = {};

    Object.keys(fromDevice).forEach(key => {
        if (key != '_id' && key != 'updated_at' && key != 'created_at') {
            if (key == 'location' || key == 'beacon_regions_monitoring' || key == 'geofence_regions_monitoring' || key == 'beacon_regions_monitoring_updated_at' || key == 'geofence_regions_monitoring_updated_at') {
                if (!util.isUndefined(toDevice[key]) && !_.isEqual(fromDevice[key], toDevice[key])) {
                    deviceUpdates[key] = toDevice[key];
                }
            } else if (util.isArray(fromDevice[key]) && util.isArray(toDevice[key])) {
                if (!_.isEqual(fromDevice[key], toDevice[key])) {
                    deviceUpdates[key] = toDevice[key];
                }
            } else if (fromDevice[key] != toDevice[key]) {
                deviceUpdates[key] = toDevice[key];
            }
        }
    });

    Object.keys(toDevice).forEach(key => {
        if (util.isUndefined(fromDevice[key]) && !util.isUndefined(toDevice[key])) {
            deviceUpdates[key] = toDevice[key];
        }   
    });

    return deviceUpdates
}

internals.needsReindexing = function(customerUpdates, deviceUpdates) {
    if (Object.keys(customerUpdates).length == 1 && customerUpdates.inbox_updated_at) {
        return false;
    }

    return true;
};

internals.partialUpdateCustomerAndDevice = function(server, customer, device, newCustomer, newDevice) {
    
    const methods = server.methods;
    const logger = server.plugins.logger.logger;

    return new Promise((resolve, reject) => {
        // customer is the customer from the db?
        // what is customer
        
        // calculate the differences between each object
        let customerUpdates = internals.customerDifferences(customer, newCustomer);
        let deviceUpdates = internals.deviceDifferences(device, newDevice);

        if (Object.keys(customerUpdates).length > 0 || Object.keys(deviceUpdates).length > 0 ) {
            logger.debug("Updating Customer! " + customer._id.toString());
            
            logger.debug(customerUpdates);
            logger.debug(deviceUpdates);

            util._extend(customer, customerUpdates);
            util._extend(device, deviceUpdates);

            customer.updated_at = moment.utc(new Date).toDate();

            let update = { updated_at: customer.updated_at };
            
            Object.keys(customerUpdates).forEach(key => {
                update[key] = customerUpdates[key]
            });

            Object.keys(deviceUpdates).forEach(key => {
                let deviceKey = "devices.$." + key;
                update[deviceKey] = deviceUpdates[key];
            });

            if (Object.keys(update).length > 0) {
                methods.customer.updateByDevice(customer._id, device._id, { "$set": update }, (err) => {
                    if (err) {
                        logger.error(err);
                        return reject(err);
                    };

                    if (internals.needsReindexing(customerUpdates, deviceUpdates)) {
                        // only index indexable attributes
                        methods.customer.index(customer, (err) => {
                            if (err) {
                                logger.error(err);
                                return reject(err);
                            }

                            return resolve({ customer: customer, device: device });
                        });    
                    }
                    
                });
            }
        } else {
            return resolve({ customer: customer, device: device });
        }   
    }); 
};


// POST /v1/events
internals.create = function(request, reply) {
    
    let logger = request.server.plugins.logger.logger;

    // parse the payload
    const currentAccountId = request.auth.credentials.account.id;
    const currentDeviceId = request.headers['x-rover-device-id'].toUpperCase();

    if (util.isNullOrUndefined(internals.dig(request, 'payload', 'data', 'attributes'))) {
        return internals.writeError(reply, 400, { status: 400, error: "Invalid JSONAPI"});
    }

    let customer = internals.parseCustomerPayload(currentAccountId, request.payload.data.attributes.user);
    
    if (customer.error) {
        return internals.writeError(reply, 400, { status: 400,  error: customer });
    }

    let device = internals.parseDevicePayload(currentDeviceId, request.payload.data.attributes.device);

    if (device.error) {
        return internals.writeError(reply, 400, { status: 400,  error: device }); 
    }

    let event = internals.parseEventPayload(request.payload.data.attributes);

    if (event.error) {
        return internals.writeError(reply, 400, { status: 400,  error: event }); 
    }

   
    request.payload = {
        customer: customer,
        device: device,
        event: event
    }

    internals.identify(request, (err, customer) => {
        if (err) {
            logger.error(util.format('%s %f', 'Request Failed', request.payload));
            logger.error(err);
            return internals.writeError(reply, 500, { status: 500, error: err });
        }

        if (customer) {
            //return internals.processEvent(request, reply, customer);
            internals.updateCustomer(request, customer, (err, updatedCustomer) => {
                if (err) {
                    logger.error(util.format('%s %f', 'Request Failed', request.payload));
                    logger.error(err);
                    return internals.writeError(reply, 500, { status: 500, error: err });
                }

                return internals.processEvent(request, reply, updatedCustomer);
            });
        } else {
            logger.error(util.format('%s %f', 'Request Failed to identify customer', request.payload));
            return internals.writeError(reply, 500, { status: 500, error: "Failed to identify customer" });
        }
    });
};

/*
    @private
    Identifies the customer
 */

internals.identify = function(request, callback) {
    const methods = request.server.methods;

    methods.application.getCurrentCustomer(request, (err, customer) => {

        if (err) {
            return callback("Failed to load customer");
        }

        // if the customer is nil we need to create one!
        if (util.isNullOrUndefined(customer)) {
            internals.createCustomer(request, (err, customer) => {
                if (err) {
                    console.warn(err);
                    return callback(err);
                }
                return callback(null, customer);
            });
        } else {
            return callback(null, customer);
        }

    });
};




internals.createCustomer = function(request, callback) {
    // create the customer make sure
    const payload = request.payload;
    const customerPayload = payload.customer;
    const devicePayload = payload.device;
    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;

    const accountId = request.auth.credentials.account.id;
    
    const insertCustomer = function(customer, device, resolve, reject) {
        let doc = customerPayload;
        doc.inbox_updated_at = moment.utc(new Date).toDate();
        doc.devices = [ devicePayload ];
        methods.customer.create(doc, (err, savedCustomer) => {
            if (err) {
                logger.error(err);
                return reject("Failed to create customer");
            }
            methods.account.incrementCounter(accountId, 'customers_count', 1, (err, success) => {
                if (err) {
                    logger.error(err);
                    return reject("Failed to update counters");
                }

                methods.customer.index(savedCustomer, (err, indexedCustomer) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(savedCustomer);
                });
            });
        });
    }

    let createCustomerTask = Promise.resolve().catch(err => { console.log(err); return callback(err)});

    if (devicePayload.token) {
        // make sure this is the only device with this token
        createCustomerTask = createCustomerTask.then(() => new Promise((resolve, reject) => {
            internals.findAndRemoveDeviceByToken.bind(request.server)(accountId, devicePayload.token, (err) => {
                if (err) {
                    return reject("Failed to remove old push token");
                }

                return resolve();
            });
        }));
    }

    if (customerPayload.identifier) {
        // this customer has an identifier
        // we want to check to see if there is an existing customer with this identifier
        // if there isn't an existing customer with that identifier then we need to create one
        createCustomerTask = createCustomerTask.then(() => new Promise((resolve, reject) => {
            methods.customer.findByQuery({ "account_id": accountId, "identifier": customerPayload.identifier}, (err, existingCustomer) => {
                if (err) {
                    return reject("Failed to lookup customer with identifier: " + customerPayload.identifier);
                }

                if (existingCustomer) {
                    logger.info('Adding device to named customer: ' + existingCustomer.identifier);
                    // we need to push device to the customer
                    methods.customer.pushDevice(existingCustomer, devicePayload, (err, savedCustomer) => {
                        if (err) {
                            return reject("Failed to add device to customer");
                        }

                        methods.customer.index(savedCustomer, (err, indexedCustomer) => {
                            if (err) {
                                return reject("Failed to re-index customer");
                            }

                            return resolve(savedCustomer)
                        });
                    });
                } else {
                    logger.info('Creating new named customer! for account id: ' + accountId);
                    return insertCustomer(customerPayload, devicePayload, resolve, reject);
                }
            });
        }));
    } else {
        // need to create the customer because it doesn't exist
        createCustomerTask = createCustomerTask.then(() => new Promise((resolve, reject) => {
            logger.info('Creating new anonymous customer! for account id: ' + accountId);
            logger.info(customerPayload);
            logger.info(devicePayload);
            return insertCustomer(customerPayload, devicePayload, resolve, reject);
        }));
    }


    return createCustomerTask.then(customer => { return callback(null, customer) }).catch(err => { return callback(err) });
};



internals.updateCustomer = function(request, customer, callback) {
    const methods = request.server.methods;
    const logger = request.server.plugins.logger.logger;
    // we need to check to see if the identifier has changed
    // customer is the current customer we have identified the device with
    const customerPayload = request.payload.customer;
    const devicePayload = request.payload.device;
    const currentDeviceId = request.headers['x-rover-device-id'].toUpperCase();
    const currentAccountId = request.auth.credentials.account.id;

    const device = customer.devices.find((device) => { return device._id == currentDeviceId });

    let updateTasks = Promise.resolve();

    if (device.token != devicePayload.token && !util.isNullOrUndefined(devicePayload.token)) {
        logger.info(`Device: ${device._id} token has changed from ${device.token} to ${devicePayload.token}`);
        updateTasks = updateTasks.then(() => new Promise((resolve, reject) => {
            internals.findAndRemoveDeviceByToken.bind(request.server)(currentAccountId, devicePayload.token, (err) => {
                if (err) {
                    return reject("Failed to remove old push token");
                }

                return resolve();
            });
        }));

    }

    if (util.isNullOrUndefined(customer.identifier) && !util.isNullOrUndefined(customerPayload.identifier) || (!util.isNullOrUndefined(customer.identifier) && !util.isNullOrUndefined(customerPayload.identifier) && customer.identifier != customerPayload.identifier)) {
        updateTasks = updateTasks.then(() => new Promise((resolve, reject) => {
            if (util.isNullOrUndefined(customer.identifier)) {
                logger.info('Customer has gone from anonymous to named');
            } else {
                logger.info('Customer has switched identifiers');
            }
            

            methods.customer.findByQuery({ "account_id": currentAccountId, "identifier": customerPayload.identifier }, (err, existingCustomer) => {
                if (err) {
                    return reject("Failed to find existing customer to merge with");
                }

                // logic branch
                if (util.isNullOrUndefined(existingCustomer) && util.isNullOrUndefined(customer.identifier)) {
                    logger.info('No exisitng customer exists - merging');
                    return resolve(customer);
                }  else if (util.isNullOrUndefined(existingCustomer)) {
                    logger.info('No existing customer exits - creating');
                } else {
                    logger.info('Existing customer - swapping device');
                }

                let tasks = [];

                // what needs to be done
                // pull device and index existing customer
                // push device and index existing customer
                // tasks.push()
                // existing customer exists we need to pull our device and push it onto the existing customer
                //
                // 
                tasks.push((callback) => {
                    methods.customer.pullDevice(customer, device, (err, customer) => {
                        if (err) {
                            logger.error(err);
                            return callback(err);
                        }

                        if (customer.devices.length == 0 && util.isNullOrUndefined(customer.identifier)) {
                            methods.customer.delete(customer, (err) => {
                                if (err) {
                                    logger.err(err);
                                    return callback(err);
                                }

                                methods.account.decrementCounter(currentAccountId, 'customers_count', 1, (err) => {
                                    if (err) {
                                        logger.error(err);
                                        return callback(err);
                                    }

                                    methods.customer.deleteIndex(customer, (err) => {
                                        if (err) {
                                            logger.error(err);
                                            return callback(err);
                                        }

                                        return callback(null);
                                    });
                                });
                            });
                            
                        } else {
                            methods.customer.index(customer, (err) => {
                                if (err) {
                                    logger.error(err);
                                    return callback(err);
                                }
                                return callback(null, customer);
                            });
                        }
                    });
                });

                if (util.isNullOrUndefined(existingCustomer)) {
                    tasks.push((callback) => {
                        internals.createCustomer(request, (err, newCustomer) => {
                            if (err) {
                                logger.error(err);
                                return callback(err);
                            }
                            existingCustomer = newCustomer;
                            return callback(null, existingCustomer);
                        });  
                    });
                } else {
                     tasks.push((callback) => {
                        methods.customer.pushDevice(existingCustomer, device, (err, existingCustomer) => {
                            if (err) {
                                logger.error(err);
                                return callback(err);
                            }

                            methods.customer.index(existingCustomer, (err) => {
                                if (err) {
                                    logger.error(err);
                                    return callback(err);
                                }

                                return callback(null, existingCustomer)
                            })
                        });
                    });
                }

                async.series(tasks, (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(results[results.length - 1]);
                });
            });
        }));
    } else if (!util.isNullOrUndefined(customer.identifier) && util.isNullOrUndefined(customerPayload.identifier)) {
        logger.info('Customer has gone from named to anonymous');
        updateTasks = updateTasks.then(() => new Promise((resolve, reject) => {
            // going from named to anonymous
            // means we need to pull device and create a new user
            // the same as above!
            methods.customer.pullDevice(customer, device, (err, customer) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }

                methods.customer.index(customer, (err) => {
                    if (err) {
                        logger.error(err);
                        return reject(err);
                    }
                    // we need to create the customer now
                    internals.createCustomer(request, (err, newCustomer) => {
                        if (err) {
                            logger.error(err);
                            return reject(err);
                        }

                        return resolve(newCustomer);
                    });
                });

            });
        }));

    } else {
        updateTasks = updateTasks.then(() => Promise.resolve(customer));
    }

    return updateTasks
            .then(customer => internals.partialUpdateCustomerAndDevice(request.server, customer, device, customerPayload, devicePayload))
            .then(({ customer, device }) => callback(null, customer))
            .catch(err => { logger.error(err); return callback(err) });

    
};

internals.processEvent = function(request, reply, customer) {
    // we have the current customer and the device 
    const logger = request.server.plugins.logger.logger;
    const newrelic = request.server.plugins.newrelic.client;

    const currentDeviceId = request.headers['x-rover-device-id'].toUpperCase();
    let device = customer.devices.find((device) => { return device._id == currentDeviceId });

    let args = {
        server: request.server,
        customer: customer,
        device: device,
        account: request.auth.credentials.account,
        input: request.payload.event
    };

    
    let event = Event.init(args);

    newrelic.setTransactionName(event.getTransactionName());
    

    event.process((err, newCustomer, newDevice, eventResponse) => {
        if (err) {
            return internals.writeError(reply, 500, { status: 500, message: err });
        }

        internals.partialUpdateCustomerAndDevice(request.server, customer, device, newCustomer, newDevice).then(({ customer, device }) => {
            
            let response = JSON.stringify(eventResponse);

            reply.writeHead(200, {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Content-Length': Buffer.byteLength(response, "utf-8")
            });
            reply.write(response);
            return reply.end();
        });
    })
};

internals.findAndRemoveDeviceByToken = function(accountId, token, callback) {
    const server = this;
    const methods = server.methods;

    methods.customer.findByQuery({"account_id": accountId, "devices.token": token }, (err, customer) => {
        if (err) {
            return callback(err);
        }

        if (customer) {
            // a customer already has a device with this token wtf!
            const device = customer.devices.find((device) => { return device.token == token });
            if (device) {
                // we need to remove this device
                methods.customer.pullDevice(customer, device, (err, savedCustomer) => {
                    if (err) {
                        return callback(err);
                    }

                    methods.customer.index(savedCustomer, (err) => {
                        if (err) {
                            return callback(err);
                        }

                        return callback();
                    });
                });
            } else {
                return callback();
            }

        } else {
            return callback();
        }
    });
};

/*
    "identifier": "chris",
    "first-name": "chris",
    "last-name": "recalis",
    "email": "crecalis@gmail.com",
    "age": 25,
    "gender": "male",
    "phone-number": "416-561-0334",
    "tags": ["hello"],
    "traits": {
        "random": "value"
    }
 */
internals.underscoreKeys = function(obj, allowedKeysSet) {
    const underscorePayload = {};

    Object.keys(obj).forEach(key => {
        let underscoreKey = key.replace(/\-/g, '_');
        let value = obj[key];
        if (allowedKeysSet && allowedKeysSet.has(key) || util.isNullOrUndefined(allowedKeysSet)) {
            underscorePayload[underscoreKey] = value;
        }
    });

    return underscorePayload;
};

// node will optimize this as an inline function
internals.parseValue = function(payload, key, type) {
    const value = payload[key];
    
    if (util.isUndefined(value)) {
        return;
    }

    if (type == Type.STRING) {
        if (!util.isString(value) || util.isString(value) && value.length == 0) {
            payload[key] = null;
        } 
    } else if (type == Type.BOOLEAN) {
        if (!util.isBoolean(value) || util.isString(value) && value.length == 0) {
            payload[key] = false;
        }
    } else if (type == Type.INTEGER) {
        if (typeof value != 'number') {
            payload[key] = null;
        }
    }

};

const customerSchema = Joi.object().required().keys({
    'identifier': Joi.string().optional().allow(null).empty(''),
    'first-name': Joi.string().optional().allow(null).empty(''),
    'last-name': Joi.string().optional().allow(null).empty(''),
    'email': Joi.string().optional().allow(null).empty(''),
    'age': Joi.number().min(0).max(199).optional().allow(null).empty(''),
    'gender': Joi.string().optional().allow(null).empty(''),
    'phone-number': Joi.string().optional().allow(null).empty(''),
    'tags':  Joi.array().items(Joi.string().empty('')).unique().sparse().allow(null),
    'traits': Joi.object().unknown().empty({})
});



internals.parseCustomerPayload = function(accountId, payload) {

    let customer = internals.underscoreKeys(payload, customerPayloadKeys);
    customer.account_id = accountId;

    if (util.isNull(customer.identifier) || util.isString(customer.identifier) && customer.identifier.length == 0) {
        delete customer.identifier;
    }

    if (!util.isNullOrUndefined(customer.tags)) {
        if (util.isArray(customer.tags)) {
            customer.tags = customer.tags.filter(tag => { return (!util.isNullOrUndefined(tag) && util.isString(tag) && tag.length > 0) });
        } else {
            customer.tags = [];
        }
    }

    internals.parseValue(customer, 'first_name', Type.STRING);
    internals.parseValue(customer, 'last_name', Type.STRING);
    internals.parseValue(customer, 'email', Type.STRING);
    internals.parseValue(customer, 'gender', Type.STRING);
    internals.parseValue(customer, 'phone_number', Type.STRING);

    internals.parseValue(customer, 'age', Type.INTEGER);
    
    return customer;
};

const deviceSchema = Joi.object().required().keys({
    'token': Joi.string().optional().allow(null),
    'locale-lang': Joi.string().optional().allow(null),
    'locale-region': Joi.string().optional().allow(null),
    'time-zone': Joi.string().optional().allow(null),
    'sdk-version': Joi.string().regex(/(\d+\.\d+\.\d+)|(\d+\.\d+)/, 'version'),
    'platform': Joi.any().only('iOS', 'Android').required(),
    'os-name': Joi.any().only('iOS', 'Android').required(),
    'os-version': Joi.string().regex(/(\d+\.\d+\.\d+)|(\d+\.\d+)/, 'version'),
    'model': Joi.string().optional().allow(null).empty(''),
    'manufacturer': Joi.string().optional().allow(null).empty(''),
    'carrier': Joi.string().optional().allow(null).empty(''),
    'app-identifier': Joi.string().required(),
    'background-enabled': Joi.boolean().optional().empty('').default(false),
    'notifications-enabled': Joi.boolean().optional().empty('').default(true),
    'location-monitoring-enabled': Joi.boolean().optional().empty('').default(false),
    'bluetooth-enabled': Joi.boolean().optional().empty('').default(false),
    'development': Joi.boolean().optional().empty('').default(false),
    'aid': Joi.string().optional().allow(null)
}).rename('remote-notifications-enabled', 'notifications-enabled');

internals.parseDevicePayload = function(id, payload) {


    let device = internals.underscoreKeys(payload, devicePayloadKeys);

    delete device.udid;
    device._id = id;

    if (!util.isString(device.app_identifier) || util.isString(device.app_identifier) && device.app_identifier.length == 0) {
        return ({ error: true, message: "device.app-identifier must be a valid string and not empty"});
    }

    if (!util.isNullOrUndefined(device.remote_notifications_enabled)) {
        device.notifications_enabled = device.remote_notifications_enabled;
        delete device.remote_notifications_enabled;
    }
    
    if (util.isNullOrUndefined(device.sdk_version) || !util.isNullOrUndefined(device.sdk_version) && util.isNullOrUndefined(device.sdk_version.match(VersionRegex))) {
        return ({ error: true,  message: "device.sdk-version must be a valid gnu version number"});
    }

    if (util.isNullOrUndefined(device.os_version) || !util.isNullOrUndefined(device.os_version) && util.isNullOrUndefined(device.os_version.match(VersionRegex))) {
        return ({ error: true, message: "device.os-version must be a valid gnu version number"});
    }

    internals.parseValue(device, 'token', Type.STRING);
    internals.parseValue(device, 'locale_lang', Type.STRING);
    internals.parseValue(device, 'locale_region', Type.STRING);
    internals.parseValue(device, 'time_zone', Type.STRING);
    internals.parseValue(device, 'sdk_version', Type.STRING);
    internals.parseValue(device, 'platform', Type.STRING);
    internals.parseValue(device, 'os_name', Type.STRING);
    internals.parseValue(device, 'model', Type.STRING);
    internals.parseValue(device, 'manufacturer', Type.STRING);
    internals.parseValue(device, 'carrier', Type.STRING);
    internals.parseValue(device, 'background_enabled', Type.BOOLEAN);
    internals.parseValue(device, 'remote_notifications_enabled', Type.BOOLEAN);
    internals.parseValue(device, 'location_monitoring_enabled', Type.BOOLEAN);
    internals.parseValue(device, 'bluetooth_enabled', Type.BOOLEAN);
    internals.parseValue(device, 'development', Type.BOOLEAN);
    internals.parseValue(device, 'aid', Type.STRING);

    if (device.locale_lang) {
        device.locale_lang = device.locale_lang.toLowerCase();
    }

    if (device.locale_region) {
        device.locale_region = device.locale_region.toLowerCase();

        if (device.locale_region.length == 3) {
            device.locale_region = ISO3611.convertAlpha3ToAlpha2(device.locale_region);
        }
    }

    if (device.carrier) {
        device.carrier = device.carrier.toLowerCase();
    }

    if (device.remote_notifications_enabled) {
        device.notifications_enabled = device.remote_notifications_enabled;
        delete device.remote_notifications_enabled;
    }

    if (device.development == true) {

        const sdkVersion = device.sdk_version.split('.').map(i => parseInt(i));
        const sdkMajor = sdkVersion[0];
        const sdkMinor = sdkVersion[1];
        const sdkRevision = sdkVersion[2];
        // We only trust development flag from sdk version 1.1.0+
        if (!(sdkMajor >= 1 && sdkMinor >= 1)) {
            device.development = false;
        }
    }

    return device
};

internals.parseEventPayload = function(payload, callback) {
    const eventAttributes = Object.assign(payload);
    delete eventAttributes['user'];
    delete eventAttributes['device'];
    return eventAttributes;
};

/*
    "locale-lang": "en",
    "locale-region": "US",
    "time-zone": "America/Toronto",
    "sdk-version": "0.5.3",
    "platform": "Android",
    "os-name": "Android",
    "os-version": "4.4.5",
    "model": "Nexus 6",
    "manufacturer": "Google",
    "carrier": "Rogers",
    "app-identifier": "io.rover.Rover",
    "background-enabled": true,
    "notifications-enabled": true,
    "bluetooth-enabled": true,
    "location-monitoring-enabled": true,
    "development": true,
    "aid": "00000-0000-0000-00000"
 */


/*
    "user": {
        "identifier": "chris",
        "first-name": "chris",
        "last-name": "recalis",
        "email": "crecalis@gmail.com",
        "age": 25,
        "gender": "male",
        "phone-number": "416-561-0334",
        "tags": ["hello"],
        "traits": {
            "random": "value"
        }
    },
 */


/*
    "locale-lang": "en",
    "locale-region": "US",
    "time-zone": "America/Toronto",
    "sdk-version": "0.5.3",
    "platform": "Android",
    "os-name": "Android",
    "os-version": "4.4.5",
    "model": "Nexus 6",
    "manufacturer": "Google",
    "carrier": "Rogers",
    "app-identifier": "io.rover.Rover",
    "background-enabled": true,
    "notifications-enabled": true,
    "bluetooth-enabled": true,
    "location-monitoring-enabled": true,
    "development": true,
    "aid": "00000-0000-0000-00000"
 */

module.exports = {
    create: internals.create
};
// module.exports.register = function(server, options, next) {
//     server.route({
//         method: 'POST',
//         path: '/v1/events',
//         handler: internals.create,
//         config: {
//             validate: {
//                 failAction: (request, reply, source, error) => {
//                     let logger = request.server.plugins.logger.logger;
//                     logger.error(util.format("%s %j", error.message, request.payload));
//                     return reply(error);
//                 },
//                 options: {
//                     stripUnknown: false
//                 },
//                 payload: {
//                     data: {
//                         type: 'events',
//                         id: Joi.string().optional(),
//                         attributes: Joi.object().keys({
//                             object: Joi.string().required(),
//                             action: Joi.string().required(),
//                             timestamp: [Joi.date().iso(), Joi.date().format("yyyy-MM-dd'T'HH:mm:ss.SSSZZZZ")],
//                             user: Joi.object().keys({
//                                 'identifier': Joi.string().optional().allow(null).empty(''),
//                                 'first-name': Joi.string().optional().allow(null).empty(''),
//                                 'last-name': Joi.string().optional().allow(null).empty(''),
//                                 'email': Joi.string().optional().allow(null).empty(''),
//                                 'age': Joi.number().min(0).max(199).optional().allow(null).empty(''),
//                                 'gender': Joi.string().optional().allow(null).empty(''),
//                                 'phone-number': Joi.string().optional().allow(null).empty(''),
//                                 'tags':  Joi.array().items(Joi.string().empty('')).unique().sparse().allow(null),
//                                 'traits': Joi.object().unknown().empty({})
//                             }).required(),
//                             device: Joi.object().unknown().keys({
//                                 token: Joi.string().optional().allow(null),
//                                 'locale-lang': Joi.string().optional().allow(null),
//                                 'locale-region': Joi.string().optional().allow(null),
//                                 'time-zone': Joi.string().optional().allow(null),
//                                 'sdk-version': Joi.string().regex(/(\d+\.\d+\.\d+)|(\d+\.\d+)/, 'version'),
//                                 'platform': Joi.any().only('iOS', 'Android').required(),
//                                 'os-name': Joi.any().only('iOS', 'Android').required(),
//                                 'os-version': Joi.string().regex(/(\d+\.\d+\.\d+)|(\d+\.\d+)/, 'version'),
//                                 'model': Joi.string().optional().allow(null),
//                                 'manufacturer': Joi.string().optional().allow(null),
//                                 'carrier': Joi.string().optional().allow(null),
//                                 'app-identifier': Joi.string().required(),
//                                 'background-enabled': Joi.boolean().required(),
//                                 'notifications-enabled': Joi.boolean().required(),
//                                 'location-monitoring-enabled': Joi.boolean().required(),
//                                 'bluetooth-enabled': Joi.boolean().required(),
//                                 'development': Joi.boolean().default(false),
//                                 'aid': Joi.string().allow(null)
//                             }).required().rename('remote-notifications-enabled', 'notifications-enabled'),
//                             // Beacon Region
//                             uuid: Joi.string(),
//                             'major-number': Joi.number().min(0).max(65535),
//                             'minor-number': Joi.number().min(0).max(65535),
//                             // Geofence Region
//                             identifier: Joi.string(),
//                             latitude: Joi.number().precision(6),
//                             longitude: Joi.number().precision(6),
//                             radius: Joi.number(),
//                             // Location
//                             accuracy: Joi.number().optional(),
//                             // Messages
//                             'message-id': Joi.string(),
//                             'source': Joi.only('inbox', 'notification'),
//                             // Gimbal
//                             'gimbal-place-id': Joi.string(),
//                             // Experiences
//                             'experience-id': Joi.string(),
//                             'version-id': Joi.string().optional(),
//                             'from-screen-id': Joi.string().optional().allow(null),
//                             'from-block-id': Joi.string().optional().allow(null),
//                             'screen-id': Joi.string(),
//                             'block-id': Joi.string(),
//                             'block-action': Joi.object().unknown()
//                         }).rename('time', 'timestamp')
//                         .when('object', {
//                             is: 'beacon-region',
//                             then: Joi.object().keys({
//                                 uuid: Joi.required(),
//                                 'major-number': Joi.required(),
//                                 'minor-number': Joi.required()
//                             })
//                         })
//                         .when('object', {
//                             is: 'location',
//                             then: Joi.object().keys({
//                                 latitude: Joi.required(),
//                                 longitude: Joi.required(),
//                                 accuracy: Joi.optional(),
//                                 radius: Joi.optional() // old sdk
//                             })
//                         })
//                         .when('object', {
//                             is: 'geofence-region',
//                             then: Joi.object().keys({
//                                 identifier: Joi.required(),
//                                 latitude: Joi.optional(),
//                                 longitude: Joi.optional(),
//                                 radius: Joi.optional(),
//                             })
//                         })
//                         .when('object', {
//                             is: 'message',
//                             then: Joi.object().keys({
//                                 'message-id': Joi.required(),
//                                 source: Joi.optional()
//                             })
//                         })
//                         .when('object', {
//                             is: 'gimbal-place',
//                             then: Joi.object().keys({
//                                 'gimbal-place-id': Joi.required()
//                             })
//                         })
//                     }
//                 }
//             }
//         }
//     });
//     next();
// };

// module.exports.register.attributes = {
//     name: 'event-controller',
// };


