'use strict';
var Promise = require('bluebird');
const util = require('util');
const ISO3611 = require('../../lib/iso-3611');
const moment = require('moment');
const async = require('async');
const Joi = require('joi');
const Event = require('../../lib/event');

const internals = {};

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

// POST /v1/events
internals.create = function(request, reply) {
	
	let logger = request.server.plugins.logger.logger;

	// parse the payload
	const currentAccountId = request.auth.credentials.account.id;
	const currentDeviceId = request.headers['x-rover-device-id'];
	
	let customerPayload = internals.parseCustomerPayload(currentAccountId, request.payload.data.attributes.user)

	let devicePayload = internals.parseDevicePayload(currentDeviceId, request.payload.data.attributes.device);

	let eventPayload = internals.parseEventPayload(request.payload.data.attributes);

	request.payload = {
		customer: customerPayload,
		device: devicePayload,
		event: eventPayload
	}
	
	logger.debug(util.format("%s %j", "Started Request:", request.payload));

	internals.identify(request, (err, customer) => {
		if (err) {
			logger.error(util.format('%s %f', 'Request Failed', request.payload));
			logger.error(err);
			return reply({ status: 500, error: err }).code(500);
		}

		if (customer) {
			//return internals.processEvent(request, reply, customer);
			internals.updateCustomer(request, customer, (err, updatedCustomer) => {
				if (err) {
					logger.error(util.format('%s %f', 'Request Failed', request.payload));
					logger.error(err);
					return reply({ status: 500, error: err }).code(500);
				}

				return internals.processEvent(request, reply, updatedCustomer);
			});
		} else {
			logger.error(util.format('%s %f', 'Request Failed to identify customer', request.payload));
			return reply({ status: 500, error: "Failed to identify customer" }).code(500);
		}
	});

};

/*
	@private
	Identifies the customer
 */

internals.identify = function(request, callback) {
	const methods = request.server.methods;

	methods.getCurrentCustomer(request, (err, customer) => {

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
	const currentDeviceId = request.headers['x-rover-device-id'];
	const currentAccountId = request.auth.credentials.account.id;

	const device = customer.devices.find((device) => { return device._id == currentDeviceId });

	let updateTasks = Promise.resolve();

	if (device.token != devicePayload.token && !util.isNullOrUndefined(devicePayload.token)) {
		logger.info(`Device: ${device._id} token has changed`);
		updateTasks = updateTasks.then(() => new Promise((resolve, reject) => {
			internals.findAndRemoveDeviceByToken.bind(request.server)(currentAccountId, devicePayload.token, (err) => {
				if (err) {
					return reject("Failed to remove old push token");
				}

				return resolve();
			});
		}));

	}

	if (util.isNullOrUndefined(customer.identifier) && !util.isNullOrUndefined(customerPayload.identifier)) {
		updateTasks = updateTasks.then(() => new Promise((resolve, reject) => {
			logger.info('Customer has gone from anonymous to named');

			methods.customer.findByQuery({ "account_id": currentAccountId, "identifier": customerPayload.identifier }, (err, existingCustomer) => {
				if (err) {
					return reject("Failed to find existing customer to merge with");
				}

				if (util.isNullOrUndefined(existingCustomer)) {
					logger.info('No exisitng customer exists');
					return resolve(customer);
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

				async.series(tasks, (err, results) => {
					if (err) {
						return reject(err);
					}

					return resolve(results[1]);
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

	return updateTasks.then(customer => new Promise((resolve, reject) => {

		// customer is the customer from the db?
		// what is customer
		
		// calculate the differences between each object
		let customerUpdates = {};
		let deviceUpdates = {};

		Object.keys(customer).forEach(key => {
			if (util.isArray(customer[key]) && util.isArray(customerPayload[key])) {
				// if in if because we don't want the next else if to run
				if (!internals.compareArrays(customer[key], customerPayload[key])) {
					customerUpdates[key] = customerPayload[key];
					customer[key] = customerPayload[key];
				}
			} else if ((key != 'devices' && key != '_id' && key != 'updated_at' && key != 'created_at') && !util.isUndefined(customerPayload[key]) && customer[key] != customerPayload[key]) {
				customerUpdates[key] = customerPayload[key];
				customer[key] = customerPayload[key];
			}
		});

		Object.keys(customerPayload).forEach(key => {
			if (util.isArray(customer[key]) && util.isArray(customerPayload[key])) {
				// if in if because we don't want the next else if to run
				if (!internals.compareArrays(customer[key], customerPayload[key])) {
					customerUpdates[key] = customerPayload[key];
					customer[key] = customerPayload[key];
				}
			} else if ((key != 'devices' && key != '_id' && key != 'updated_at' && key != 'created_at') && !util.isUndefined(customerPayload[key]) && customer[key] != customerPayload[key]) {
				customerUpdates[key] = customerPayload[key];
				customer[key] = customerPayload[key];
			}
		});

		// find the differences between device and payload
		
		Object.keys(device).forEach(key => {
			if (key != '_id' && key != 'updated_at' && key != 'created_at' && device[key] != devicePayload[key]) {
				deviceUpdates[key] = devicePayload[key];
				device[key] = devicePayload[key];
			}
		});

		Object.keys(devicePayload).forEach(key => {
			if (key != '_id' && key != 'updated_at' && key != 'created_at' && device[key] != devicePayload[key]) {
				deviceUpdates[key] = devicePayload[key];
				device[key] = devicePayload[key]
			}
		});
		


		if (Object.keys(customerUpdates).length > 0 || Object.keys(deviceUpdates).length > 0 ) {
			logger.info("Updating customer!");
			let update = { };
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

					methods.customer.index(customer, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}

						return resolve(customer);
					});
				});
			}
		} else {
			return resolve(customer);
		}
	}))
	.then(customer => callback(null, customer))
	.catch(err => { logger.error(err); return callback(err) });

	
};

/*
	{
		"data": {
			"type": "events",
			"id": "123",
			"attributes": {
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
				"device": {
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
				}
			}
		}she
	}
 */
internals.processEvent = function(request, reply, customer) {
	// we have the current customer and the device 
	const logger = request.server.plugins.logger.logger;

	const currentDeviceId = request.headers['x-rover-device-id'];
	let device = customer.devices.find((device) => { return device._id == currentDeviceId });

	let args = {
		server: request.server,
		customer: customer,
		device: device,
		account: request.auth.credentials.account,
		input: request.payload.event
	};

	
	let event = Event.init(args);

	

	event.process((err, processedEvent) => {
		if (err) {
			logger.error(util.format('%s %f', 'Processor Failed', args));
			logger.error(err);
			return reply({ status: 500, message: "Internal Server Error: support has been notified"}).code(500);
		}
		console.info(processedEvent);
		return reply(processedEvent).code(200);
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
internals.underscoreKeys = function(obj) {
	const underscorePayload = {};

    Object.keys(obj).forEach(key => {
        let underscoreKey = key.replace(/\-/g, '_');
        let value = obj[key];

        if (util.isString(value) && value == '') {
            value = null;
        }

        underscorePayload[underscoreKey] = value

    });

    return underscorePayload;
};

internals.parseCustomerPayload = function(accountId, payload) {
    // if empty string we treat them as null
    // we don't want to treat not setting the value as null this is bad!
   	let customer = internals.underscoreKeys(payload);
   	customer.account_id = accountId;

   	if (util.isNull(customer.identifier)) {
   		delete customer.identifier;
   	}

   	customer.tags = customer.tags.filter(tag => !util.isNullOrUndefined(tag));
   	return customer;
};

internals.parseDevicePayload = function(id, payload) {
	let device = internals.underscoreKeys(payload);
	
	delete device.udid;
	device._id = id;

	if (device.locale_lang) {
		device.locale_lang = device.locale_lang.toLowerCase();
	}

	if (device.locale_region) {
		device.locale_region = device.locale_region.toLowerCase();

		if (device.locale_region.length == 3) {
			device.locale_region = ISO3611.convert_alpha3_to_alpha2(device.locale_region);
		}
	}

	if (device.carrier) {
		device.carrier = device.carrier.toLowerCase();
	}

	if (device.remote_notifications_enabled) {
		device.notifications_enabled = device.remote_notifications_enabled;
		delete device.remote_notifications_enabled;
	}

	return device;
};

internals.parseEventPayload = function(payload) {
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

module.exports.register = function(server, options, next) {
	server.route({
		method: 'POST',
		path: '/v1/events',
		handler: internals.create,
		config: {
			validate: {
				failAction: (request, reply, source, error) => {
					let logger = request.server.plugins.logger.logger;
					logger.error(util.format("%s %j", error.message, request.payload));
					return reply(error);
				},
				options: {
					stripUnknown: false
				},
				payload: {
					data: {
						type: 'events',
						id: Joi.string().optional(),
						attributes: Joi.object().keys({
							object: Joi.string().required(),
							action: Joi.string().required(),
							timestamp: [Joi.date().iso(), Joi.date().format("yyyy-MM-dd'T'HH:mm:ss.SSSZZZZ")],
							user: Joi.object().keys({
								'identifier': Joi.string().optional().allow(null).empty(''),
								'first-name': Joi.string().optional().allow(null).empty(''),
								'last-name': Joi.string().optional().allow(null).empty(''),
								'email': Joi.string().optional().allow(null).empty(''),
								'age': Joi.number().min(0).max(199).optional().allow(null).empty(''),
								'gender': Joi.string().optional().allow(null).empty(''),
								'phone-number': Joi.string().optional().allow(null).empty(''),
								'tags':  Joi.array().items(Joi.string().empty('')).unique().sparse().allow(null),
								'traits': Joi.object().unknown().allow(null)
							}).required(),
							device: Joi.object().unknown().keys({
								token: Joi.string().optional().allow(null),
								'locale-lang': Joi.string().optional().allow(null),
								'locale-region': Joi.string().optional().allow(null),
								'time-zone': Joi.string().optional().allow(null),
								'sdk-version': Joi.string().regex(/(\d+\.\d+\.\d+)|(\d+\.\d+)/, 'version'),
								'platform': Joi.any().only('iOS', 'Android').required(),
								'os-name': Joi.any().only('iOS', 'Android').required(),
								'os-version': Joi.string().regex(/(\d+\.\d+\.\d+)|(\d+\.\d+)/, 'version'),
								'model': Joi.string().optional().allow(null),
								'manufacturer': Joi.string().optional().allow(null),
								'carrier': Joi.string().optional().allow(null),
								'app-identifier': Joi.string().required(),
								'background-enabled': Joi.boolean().required(),
								'notifications-enabled': Joi.boolean().required(),
								'location-monitoring-enabled': Joi.boolean().required(),
								'bluetooth-enabled': Joi.boolean().required(),
								'development': Joi.boolean().default(false),
								'aid': Joi.string().allow(null)
							}).required().rename('remote-notifications-enabled', 'notifications-enabled'),
							// Beacon Region
							uuid: Joi.string(),
							'major-number': Joi.number().min(0).max(65535),
							'minor-number': Joi.number().min(0).max(65535),
							// Geofence Region
							identifier: Joi.string(),
							latitude: Joi.number().precision(6),
							longitude: Joi.number().precision(6),
							radius: Joi.number(),
							// Location
							accuracy: Joi.number().optional(),
						}).rename('time', 'timestamp')
						.when('object', {
							is: 'beacon-region',
							then: Joi.object().keys({
								uuid: Joi.required(),
								'major-number': Joi.required(),
								'minor-number': Joi.required()
							})
						})
						.when('object', {
							is: 'location',
							then: Joi.object().keys({
								latitude: Joi.required(),
								longitude: Joi.required(),
								accuracy: Joi.optional(),
								radius: Joi.optional() // old sdk
							})
						})
						.when('object', {
							is: 'geofence-region',
							then: Joi.object().keys({
								identifier: Joi.required(),
								latitude: Joi.optional(),
								longitude: Joi.optional(),
								radius: Joi.optional(),
							})
						})
					}
				}
			}
		}
	});
	next();
};

module.exports.register.attributes = {
	name: 'event-controller',
};


