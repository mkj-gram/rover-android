'use strict';

var Promise = require('bluebird');

const util = require('util');
const uuid = require('uuid');
const SegmentFilter = require('@rover/segment-filter');
const moment = require('moment');
const Config = require('./config');
const path = require('path');
const fs = require("fs");
const fcm = require('node-gcm');
const fcmCCS = require('@rover/node-fcm-ccs');
const apn = require('apn');
const ObjectID = require('mongodb').ObjectID;
const RoverApis = require("@rover/apis")
const retry = require('retry');

const JobError = require('./errors/job-error');
const RoverEvent = require('./rover-event');

const JOB_TIMEOUT_TIME = 1000 * 60 * 5; // 5 minutes to complete before forever dying
const READ_BATCH_SIZE = Config.get('/worker/read_batch_size');
const BATCH_SIZE = Config.get('/worker/batch_size');
const INBOX_KEY_PREFIX = "inbox_";
const RATE_LIMIT_KEY_PREFIX = "msgrl_";
const INBOX_LIMIT = 150;
const LIBRATO_SOURCE = 'scheduled-messages-worker';
const APNS_CONCURRENCY = Config.get('/worker/apns_concurrency');

const isEmptyObject = (obj) => {
    return !Object.keys(obj).length;
};

const hasDevices = (customer) => {
    return (!util.isNullOrUndefined(customer.devices) && util.isArray(customer.devices) && customer.devices.length >= 1);
};

const hasPushToken = (device) => {
    return !(util.isNullOrUndefined(device) || (!util.isNullOrUndefined(device) && util.isNullOrUndefined(device.token) || util.isString(device.token) && device.token.length == 0 ))
}

const parseCustomer = (customer) => {
    // we are coming from elasticsearch here
    if (customer.hasOwnProperty("_source")) {
        let source = customer._source;
        source._id = ObjectID(customer._id);
        return source;
    } else {
        // return the monogdb customer
        return customer;
    }
}

const roverInboxApnsProductionClient = new apn.Provider({
    pfx: fs.readFileSync(path.join(process.cwd(), '/apns-certs/io.rover.inbox.p12')),
    passphrase: null,
    production: true
});

const roverInboxApnsDevelopmentClient = new apn.Provider({
    pfx: fs.readFileSync(path.join(process.cwd(), '/apns-certs/io.rover.inbox.p12')),
    passphrase: null,
    production: false
});

const JOB_STATE = {
    _getSegment: 1,
    _queueNextJob: 2,
    _getCustomersFromMongo: 3,
    _rateLimitMessages: 4,
    _saveMessages: 5,
    _addMessagesToInbox: 6,
    _updateCustomerInboxCacheKey: 7,
    _sendNotifications: 8,
    _updateStats: 9
}

function JobProcessor(jobId, server, context, previousState) {
    if (!(this instanceof JobProcessor)) {
        return new JobProcessor(jobId, server, context, previousState);
    }

    this._server = server;
    this._context = context;
    this._id = jobId || uuid.v1();
    this._shouldProcess = true;
    this._currentState = 0;
    if (util.isNullOrUndefined(previousState)) {
        this._previousState = 0;
    } else {
        this._previousState = previousState;
    }
    this._createdAt = Date.now();
    this._startedProcessingAt = Date.now();
    this._updatedStateAt = Date.now();
    this._notificationsSent = 0;
    this._notificationsFailed = 0;
    this._debug = require('debug')('job:' + this._id);
    this._debug.log = console.info.bind(console);
    this._debug("Initialized");
};

JobProcessor.prototype.setId = function(newId) {
    this._id = newId;
    return;
};

JobProcessor.prototype.getId = function() {
    return this._id;
};

JobProcessor.prototype.getState = function() {
    return this._currentState;
};

JobProcessor.prototype.getStateUpdatedAt = function() {
    return this._updatedStateAt;
};

JobProcessor.prototype.getErrorContext = function() {
    return {
        id: this._id,
        account: {
            id: this._context.account.id
        },
        message_template: this._context.messageTemplate,
        platform_credentials: {
            apns: !(util.isNullOrUndefined(this._context.platformCredentials) && util.isNullOrUndefined(this._context.platformCredentials.apns.certificate)),
            fcm: !(util.isNullOrUndefined(this._context.platformCredentials) && util.isNullOrUndefined(this._context.platformCredentials.fcm.api_key))
        },
        preference: this._context.preference,
        query: this._context.query,
        segment: this._context.segment,
        static_segment_id: this._context.staticSegmentId
    }  
};

JobProcessor.prototype.shutdown = function() {
    this._shouldProcess = false;
    return;
};

JobProcessor.prototype.process = function(done) {
    this._startedProcessingAt = Date.now();

    let logger = this._server.plugins.logger.logger;

    this._debug(`Started previous state ${this._previousState}`);

    let self = this;

    let job = Promise
    .resolve()

    if (!util.isNullOrUndefined(this._context.staticSegmentId)) {
        job = job.then(() => this._getSegmentFromService())
            .then(response => this._queueNextJob(response))

    } else {
        job = job.then(() => this._getSegmentFromElasticsearch())
            .then(response => this._queueNextJob(response))
            .then(() => this._filterCustomersBySegment())
    }
    
    job
    .then(() => this._rateLimitMessages())
    .then(() => this._saveMessages())
    .then(() => this._addMessagesToInbox())
    .then(() => this._updateCustomerInboxCacheKey())
    .then(() => this._sendNotifications())
    .then(() => this._updateStats())
    .then(() => this.cleanup())
    .then(() => {
        this._debug("Finished");
        return done();
    })
    .timeout(JOB_TIMEOUT_TIME)
    .catch(Promise.TimeoutError, function(e) {
        if (self._currentState > JOB_STATE._rateLimitMessages) {
            return done(new JobError("Timedout in state: " + self._currentState, false));
        } else {
            return done(new JobError("Timedout in state: " + self._currentState, true));
        }
    })
    .catch(JobError, function(e) {
        return done(e);
    })
    .catch(function(e) {
        // TODO:
        // raise sentry error if enabled
        return done(e);
    });
};

JobProcessor.prototype.updateState = function(newState) {
    this._currentState = newState;
    this._updatedStateAt = Date.now();
    return;
};

JobProcessor.prototype._getElasticsearchIndex = function(account) {
    return "customers_account_" + account.id;
};

JobProcessor.prototype._getSegmentFromService = function() {
    return new Promise((resolve, reject) => {
        this._debug("Reading batch from Segment service");

        let SegmentClient = require("@rover/segment-client").v1.Client()

        let nextCursor = this._context.nextCursor || ''

        let authContext = new RoverApis.auth.v1.Models.AuthContext()

        authContext.setAccountId(this._context.account.id)
        authContext.setPermissionScopesList(["internal", "app:smw"])

        const readbatch = function(request, callback) {

            const operation = retry.operation({
                retries: 5,
                factor: 2,
                minTimeout: 1 * 1000,
                maxTimeout: 60 * 1000,
                randomize: false,
            });

            operation.attempt(function(current) {
                // 20 second timeout
                const deadline = new Date(Date.now() + 20 * 1000)

                SegmentClient.getStaticSegmentPushIds(request, { deadline: deadline }, function(err, response) {
                    /* Check if we should retry */
                    if (operation.retry(err)) {
                        return;
                    }

                    if (err) {
                        return callback(err)
                    }

                    return callback(null, response)
                })
            })
        }


        
        const request = new RoverApis.segment.v1.Models.GetStaticSegmentPushIdsRequest()

        request.setAuthContext(authContext)
        request.setCursor(nextCursor)
        request.setSegmentId(this._context.staticSegmentId)
        request.setBatchSize(READ_BATCH_SIZE)

        this._debug("Reading batch: staticSegmentId=" + this._context.staticSegmentId + " nextCursor=" + nextCursor)
        readbatch(request, (err, response) => {
            if (err) {
                return reject(err)
            }        

            const identifiers = response.getPushIdsList().map(function(pushId) {
                return pushId.getId()
            })

            this._getCustomersFromIdentifiers(identifiers)
            .then(customers => {
                this.updateState(JOB_STATE._getSegment)
                this._customers = customers
                return resolve(response)
            })
            .catch(err => {
                return reject(err)
            })
        })
        
    })
}

JobProcessor.prototype._getCustomersFromIdentifiers = function(identifiers) {

    if (util.isNullOrUndefined(identifiers) || util.isArray(identifiers) && identifiers.length == 0) {
        return Promise.resolve([]);
    }

    function profileToCustomer(profile, devices) {
        function getDocumentBucket(id) {
            return ((parseInt(id, 16) % 5) + 1)
        }

        function deviceToDoc(device) {
            const doc =  {
                _id: device.id,
                token: device.push_token,
                locale_lang: device.locale_language,
                locale_region: device.locale_region,
                time_zone: device.time_zone,
                app_identifier: device.app_namespace,
                platform: device.platform,
                os_name: device.os_name,
                os_version: device.os_version,
                model: device.device_model,
                manufacturer: device.device_manufacturer,
                carrier: device.carrier_name,
                background_enabled: device.is_background_enabled,
                notifications_enabled: device.push_token_is_active,
                location_monitoring_enabled: device.is_location_monitoring_enabled,
                bluetooth_enabled: device.is_bluetooth_enabled,
                development: device.push_environment === "development",
                is_test_device: device.is_test_device || false
            }

            if (device.location_longitude !== 0 && device.location_latitude !== 0 && device.location_longitude !== null && device.location_latitude !== null) {
                doc.location = {
                    lat: device.location_latitude,
                    lon: device.location_longitude
                }
            }

            if (device.sdk_version) {
                doc.sdk_version = device.sdk_version
            }

            return doc
        }

        const customer = {
            _id: profile.id,
            account_id: profile.account_id,
            identifier: profile.identifier,
            first_name: profile['first-name'],
            last_name: profile['last-name'],
            email: profile.email,
            phone_number: profile['phone-number'],
            age: profile.age,
            gender: profile.gender,
            tags: profile.tags || [],
            traits: {},
            document_bucket: getDocumentBucket(profile.id),
            devices: (devices || []).map(deviceToDoc)

        }

        return customer
    }

    return new Promise((resolve, reject) => {
        
        this._debug("Reading customer identifiers");

        let methods = this._server.methods;
        let logger = this._server.plugins.logger.logger;
        let accountId = this._context.account.id;

        methods.profile.findAllByIdentifiers(accountId, identifiers, (err, profiles) => {
            if (err) {
                return reject(new JobError("failed to read profiles from audience service", true))
            }

            this._debug("Finished reading profiles")

            // now we need to get all of their devices and map them back to old school style yall
            
            const profileIds = profiles.map(profile => profile.id)

            methods.device.findAllByProfileIds(accountId, profileIds, (err, deviceIndex) => {
                if (err) {
                    return reject(new JobError("failed to read devices from audience service", true))
                }

                this._debug("Finished reading devices")

                let customers = profiles.map(profile => {
                    return profileToCustomer(profile, deviceIndex[profile.id])
                })

                return resolve(customers)
            })
        })
    });

};

JobProcessor.prototype._getSegmentFromElasticsearch = function() {
    return new Promise((resolve, reject) => {

        this._debug("Reading batch from elasticsearch");

        let query = this._context.query;

        if (util.isNullOrUndefined(query)) {
            return reject();
        }

        query = util._extend(query, { size: READ_BATCH_SIZE });

        let elasticsearch = this._server.connections.elasticsearch.client;
        let logger = this._server.plugins.logger.logger;

        let scrollId = this._context.scrollId;
        let account = this._context.account;
        let preference = this._context.preference;
        let offset = this._context.offset;

        let elasticsearchQuery = {};

        let readPromise;

        let readStartTime = Date.now();

        if (util.isNullOrUndefined(scrollId)) {
            // we need to scroll
            elasticsearchQuery = {
                index: this._getElasticsearchIndex(account),
                type: 'customer',
                body: query,
                search_type: 'scan',
                scroll: '30m'
            }

            if (preference) {
                elasticsearchQuery = util._extend(elasticsearchQuery, { preference: preference });
            }

            readPromise = elasticsearch.search(elasticsearchQuery);
        } else {

            elasticsearchQuery = {
                scroll: '30m',
                scrollId: scrollId,
            }

            readPromise = elasticsearch.scroll(elasticsearchQuery);
        }

        const scroll = (scrollId, customers, callback) => {
            elasticsearch.scroll({ scrollId: scrollId, scroll: '30m'}).then(response => {
                if (!util.isNullOrUndefined(response.hits.hits)) {
                    customers = customers.concat(response.hits.hits.map(source => parseCustomer(source)));
                }

                if (response.hits.hits.length < READ_BATCH_SIZE || customers.length >= BATCH_SIZE) {
                    return callback(null, customers, response);
                } else {
                    return scroll(response._scroll_id, customers, callback);
                }
            }).catch(err => {
                return callback(err, customers, null);
            });
        }



        readPromise.then(response => {

            let parsedCustomers = [];

            if (!util.isNullOrUndefined(response.hits.hits)) {
                parsedCustomers = response.hits.hits.map(source => parseCustomer(source));  
            }

            scroll(response._scroll_id, parsedCustomers, (err, customers, lastResponse) => {
                if (err) {
                    console.warn(err);
                }

                this._customers = customers;

                this._debug("Finished reading: " + this._customers.length + " customers");
                this.updateState(JOB_STATE._getSegment);
                return resolve(lastResponse);
            });
        }).catch(err => {
            console.warn(err);
            return reject(err);
        });
    });
};

JobProcessor.prototype._queueNextJob = function(response) {
    // this._previousState < JOB_STATE._queueNextJob
    // means if we crashed before this function could run we are allowed to queue the next job
    // if however we crash finding customers from mongo we shouldn't queue the job again or else there will be
    // duplicate job
    // 

    let queueMore = false

    if (response instanceof RoverApis.segment.v1.Models.GetStaticSegmentPushIdsReply) {
        queueMore = response.getFinished() == false
    } else {
        queueMore = this._customers.length >= BATCH_SIZE
    }

    if (this._previousState < JOB_STATE._queueNextJob && queueMore) {
        this._debug("Queueing next job");

        let nextJobArguments = {
            message_template: this._context.messageTemplate,
            account: this._context.account,
            query: this._context.query,
            segment: this._context.segment,
            static_segment_id: this._context.staticSegmentId,
            platform_credentials: this._context.platformCredentials,
            static_segment_id: this._context.staticSegmentId,
            test_customer_ids: this._context.testCustomerIds
        }

        if (response instanceof RoverApis.segment.v1.Models.GetStaticSegmentPushIdsReply) {
            nextJobArguments["next_cursor"] = response.getNextCursor()
        } else {
            let newOffset = this._context.offset + response.hits.hits.length;
            nextJobArguments["scroll_id"] = response._scroll_id
            nextJobArguments["offset"] = newOffset
        }

        let channel = this._server.connections.rabbitmq.channel;
        let workerQueue = this._server.connections.rabbitmq.workerQueue;
        let logger = this._server.plugins.logger.logger;

        channel.sendToQueue(workerQueue.queue, new Buffer(JSON.stringify(nextJobArguments)), {});
        this._debug("Job Queued");
    }

    this.updateState(JOB_STATE._queueNextJob);

    return Promise.resolve();
};

JobProcessor.prototype._filterCustomersBySegment = function() {
    
    this._debug("Applying memory based segment filtering");

    if (util.isNullOrUndefined(this._context.segment) || isEmptyObject(this._context.segment)) {
        this._debug("Finished filtering");
        return Promise.resolve();
    }

    let deviceFilters = this._context.segment.filters.filter(filter => filter.model == 'device');

    if (deviceFilters.length == 0) {
        this._debug("Finished filtering");
        return Promise.resolve();
    }

    let segment = new SegmentFilter(deviceFilters);

    

    this._customers.forEach(customer => {
        
        if (customer && (util.isNullOrUndefined(customer.devices) || util.isArray(customer.devices) && ( customer.devices.length == 0 || customer.devices.length == 1))) {
            return;
        }

        customer.devices = customer.devices.filter(device => {
            let result = segment.withinSegmentSync(customer, device);

            if (result.error == true ) {
                return false;
            } else {
                return true;
            }

        });
    });

    this.updateState(JOB_STATE._filterCustomersBySegment);

    this._debug("Finished filtering");
    return Promise.resolve();
};

JobProcessor.prototype._rateLimitMessages = function() {
    let messageLimits = this._context.account.message_limits;

    if (util.isNullOrUndefined(messageLimits) || !util.isArray(messageLimits) || util.isArray(messageLimits) && messageLimits.length == 0) {
        return Promise.resolve();
    }

    let redis = this._server.connections.redis.client;

    return new Promise((resolve, reject) => {
        const limits = this._context.account.message_limits;
        const sortedLimits = limits.sort((a,b) => { return a.number_of_seconds >= b.number_of_seconds });
        const largestLimit = sortedLimits[sortedLimits.length - 1];
        const currentTime = moment.utc(new Date());

        let dropInterval = currentTime.subtract(largestLimit.number_of_seconds, 'seconds').unix();

        const filterCustomers = (limit) => {
            return function(customers) {
                
                return new Promise((resolve, reject) => {

                    // If have filtered out all customers keep moving on
                    if (customers.length == 0) {
                        return resolve(customers);
                    }

                    let limitDropInterval = currentTime.subtract(limit.number_of_seconds, 'seconds').unix();
                    let multi = redis.multi();

                    for (let i = 0; i < customers.length; i++) {
                         let key = RATE_LIMIT_KEY_PREFIX + customers[i]._id.toString();
                        // count number of messages sent to this user based on the time window
                        // ie count how many messages sent in the last 1 day
                        multi.zcount(key, limitDropInterval, "+inf");
                    }

                    multi.exec((err, replies) => {
                        if (err) {
                            return reject(new JobError(err.message, true));
                        }

                        let filteredCustomers = [];

                        for (let i = 0; i < replies.length; i++) {
                            if (replies[i] < limit.message_limit) {
                                filteredCustomers.push(customers[i]);
                            }
                        }

                        return resolve(filteredCustomers);
                    });
                })
            }
        }

        let promises = [ Promise.resolve(this._customers) ]

        for(let i = 0; i < sortedLimits.length; i++) {
            promises.push(filterCustomers(sortedLimits[i]));
        }

        promises.reduce((promise, next) => promise.then(next)).then(customers => {
            this._customers = customers;

            let multi = redis.multi();

            for ( let i = 0; i < this._customers; i++) {
                // clean up
                let key = RATE_LIMIT_KEY_PREFIX + this._customers[i]._id.toString();
                multi.zremrangebyscore(key, "-inf", dropInterval);
            }

            multi.exec((err, replies) => {
                if (err) {
                    return reject(new JobError(err.message, true));
                }

                this.updateState(JOB_STATE._rateLimitMessages);

                return resolve();
            });
        });
    });
};

JobProcessor.prototype._saveMessages = function() {
    
    this._debug("Saving messages");

    if (this._customers.length == 0) {
        this._messagesIndex = [];
        return Promise.resolve();
    }
    
    let logger = this._server.plugins.logger.logger;

    let startTime = Date.now();

    this._messagesIndex = [];

    let currentTime = moment.utc(new Date()).toDate();

    this._debug("Generating messages");

    this._customers.forEach(customer => {
        let message = this._generateMessage(customer, currentTime);
        this._messagesIndex.push({ message: message, devices: customer.devices, customer: customer});
        return;
    });

    this._debug("Messages generated");

    return new Promise((resolve, reject) => {
        let methods = this._server.methods;
        let messagesToInsert = this._messagesIndex.map(index => index.message );

        this._debug("Bulk inserting: " + messagesToInsert.length + " messages");

        methods.message.bulkInsert(messagesToInsert, (err, insertedMessages) => {
            if (err) {
                return reject(err);
            }

            this._debug("Bulk insert complete");
            this._debug("Filtering saved messages");

            let insertedMessagesSet = new Set();

            insertedMessages.forEach(message => {
                insertedMessagesSet.add(message._id.toString());
            });

            this._messagesIndex = this._messagesIndex.filter(index => insertedMessagesSet.has(index.message._id.toString()));

            let totalTime = Date.now() - startTime;

            this._debug("Finished filtering saved messages");
            this.updateState(JOB_STATE._saveMessages);
            return resolve();
        });
    });
};

JobProcessor.prototype._addMessagesToInbox = function() {

    this._debug("Adding messages to inbox");

    if (this._context.messageTemplate.save_to_inbox == false) {
        this._debug("Finished adding messages to inbox");
        return Promise.resolve();
    }

    let logger = this._server.plugins.logger.logger;
    let redis = this._server.connections.redis.client;
    let messageLimits = this._context.account.message_limits;
    let largestLimit;
    let currentTime = moment.utc(new Date()).unix();
    let startTime = Date.now();

    if (!util.isNullOrUndefined(messageLimits) || util.isArray(messageLimits) && messageLimits.length > 0) {
        largestLimit = this._context.account.message_limits.sort((a,b) => { return a.number_of_seconds >= b.number_of_seconds })[this._context.account.message_limits.length - 1];
    }

    let batch = redis.batch();

    for (let i = this._messagesIndex.length - 1; i >= 0; i--) {
        let message = this._messagesIndex[i].message;
        let inboxKey = INBOX_KEY_PREFIX + message.customer_id.toString();
        let rateLimitKey = RATE_LIMIT_KEY_PREFIX + message.customer_id.toString();

        batch.lpush(inboxKey, message._id.toString());

        if (!util.isNullOrUndefined(largestLimit)) {
            batch.zadd(rateLimitKey, currentTime, currentTime);
            batch.expire(rateLimitKey, largestLimit.number_of_seconds);
        }
    }

    return new Promise((resolve, reject) => {
        batch.exec((err, replies) => {
            if (err) {
                return reject(new JobError(err.message, false));
            }

            let totalTime = Date.now() - startTime;
            this._debug("Finished adding messages to inbox");

            this.updateState(JOB_STATE._addMessagesToInbox);

            let accountId = this._context.account.id;
            let messageTemplate = this._context.messageTemplate;
            let currentTime = moment.utc(new Date()).unix();
            
            this._debug("Capturing added-to-inbox events");

            for (let i = this._messagesIndex.length - 1; i >= 0; i--) {
                let index = this._messagesIndex[i];
                let message = index.message;
                let customer = index.customer;

                RoverEvent.addedToInbox(accountId, customer, message, messageTemplate, currentTime);
            }

            this._debug("Events captured");

            return resolve();
        }); 
    });
};

JobProcessor.prototype._updateCustomerInboxCacheKey = function() {

    this._debug("Updating customers inbox cache keys");

    if (util.isNullOrUndefined(this._messagesIndex) || !util.isArray(this._messagesIndex)) {
        this._debug("Finished updating inbox cache keys");
        return Promise.resolve();
    }

    if (this._context.messageTemplate.save_to_inbox == false) {
        this._debug("Finished updating inbox cache keys");
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let customerIds = this._messagesIndex.map(index => index.customer._id);
        let methods = this._server.methods;
        let currentTime = moment.utc().toDate();

        if (customerIds.length == 0) {
            return resolve();
        }

        methods.inbox.updateManyCacheKeys(customerIds, currentTime, (err) => {
            if (err) {
                return reject(new JobError(err.message, false))
            }

            return resolve()
        })
    });
};

JobProcessor.prototype._sendNotifications = function() {
    
    this._debug("Generating push notifications");

    let androidMessages = [];
    let iosRoverDevelopmentMessages = [];
    let iosRoverProductionMessages = [];
    let iosRoverDebugDevelopmentMessages = [];
    let iosRoverDebugProductionMessages = [];
    let iosRoverInboxDevelopmentMessages = [];
    let iosRoverInboxProductionMessages = [];
    let iosCustomerDevelopmentMessages = [];
    let iosCustomerProductionMessages = [];

    for (var i = 0; i < this._messagesIndex.length; i++) {
        
        let index = this._messagesIndex[i];
        let message = index.message;
        let devices = index.devices;
        let customer = index.customer;

        devices.forEach(device => {
            if (hasPushToken(device)) {
                let pushIndex = { message: message, device: device, customer: customer };
                if (device.os_name == "Android") {
                    androidMessages.push(pushIndex);
                } else if(device.os_name == "iOS") {
                    if (device.app_identifier == 'io.rover.Rover') {
                        if (device.development == true) {
                            iosRoverDevelopmentMessages.push(pushIndex);
                        } else {
                            iosRoverProductionMessages.push(pushIndex);
                        }
                    } else if(device.app_identifier == 'io.rover.debug') {
                        if (device.development == true) {
                            iosRoverDebugDevelopmentMessages.push(pushIndex);
                        } else {
                            iosRoverDebugProductionMessages.push(pushIndex);
                        }
                    } else if(device.app_identifier == 'io.rover.Inbox') {
                        if (device.development == true) {
                            iosRoverInboxDevelopmentMessages.push(pushIndex);
                        } else {
                            iosRoverInboxProductionMessages.push(pushIndex);
                        }
                    } else {
                        if (device.development == true) {
                            iosCustomerDevelopmentMessages.push(pushIndex);
                        } else {
                            iosCustomerProductionMessages.push(pushIndex);
                        }
                    }
                }
            }   
        });
    }

    this._debug("Push notifications generated");
    this._debug("Sending push notifications");

    let pushPromises = [];

    if (!util.isNullOrUndefined(this._context.platformCredentials) && !util.isNullOrUndefined(this._context.platformCredentials.fcm)) {
        
        let apiKey = this._context.platformCredentials.fcm.api_key;
        let messagingToken = this._context.platformCredentials.fcm.messaging_token;
        let senderId = this._context.platformCredentials.fcm.sender_id;

        if (!util.isNullOrUndefined(senderId) && !util.isNullOrUndefined(messagingToken)) {
            var androidClient = fcmCCS.Client(senderId, messagingToken, {});
            /*
                There should only be 100 outstanding messages
                https://developers.google.com/cloud-messaging/ccs#flow
            */
            androidClient.maxPendingMessages = 100;
            pushPromises.push(this._sendAndroidXMPPNotifications(androidClient, androidMessages));
        } else if(!util.isNullOrUndefined(apiKey)) {
            let androidClient = fcm.Sender(apiKey);
            pushPromises.push(this._sendAndroidNotifications(androidClient, androidMessages));  
        }
    }

    if (!util.isNullOrUndefined(this._context.platformCredentials) && !util.isNullOrUndefined(this._context.platformCredentials.apns) && !util.isNullOrUndefined(this._context.platformCredentials.apns.certificate)) {
        let passphrase = this._context.platformCredentials.apns.passphrase;
        let topic = this._context.platformCredentials.apns.topic;

        let iosCustomerProductionClient =  new apn.Provider({
            pfx: Buffer.from(this._context.platformCredentials.apns.certificate, 'base64'),
            passphrase: passphrase,
            production: true
        });

        pushPromises.push(this._sendIOSNotifications(iosCustomerProductionClient, topic, iosCustomerProductionMessages));

        let iosCustomerDevelopmentClient =  new apn.Provider({
            pfx: Buffer.from(this._context.platformCredentials.apns.certificate, 'base64'),
            passphrase: passphrase,
            production: false
        });

        pushPromises.push(this._sendIOSNotifications(iosCustomerDevelopmentClient, topic, iosCustomerDevelopmentMessages))
    }

    if (iosRoverInboxProductionMessages.length > 0)
        pushPromises.push(this._sendIOSNotifications(roverInboxApnsProductionClient, 'io.rover.Inbox', iosRoverInboxProductionMessages));
    if (iosRoverInboxDevelopmentMessages.length > 0)
        pushPromises.push(this._sendIOSNotifications(roverInboxApnsDevelopmentClient, 'io.rover.Inbox', iosRoverInboxDevelopmentMessages));

    // Skip any errors
    return Promise.all(pushPromises).then(() => {
        this._debug("Finished sending push notifications");
        this.updateState(JOB_STATE._sendNotifications);
        return Promise.resolve();
    }).catch(err => {
        this._debug("Finished sending push notifications");
        console.warn(err);
        // TODO:
        // raise sentry error
        return Promise.resolve()
    });
};

JobProcessor.prototype._sendAndroidXMPPNotifications = function(client, androidMessages) {

    let xmppDebug = require('debug')(`job:${this._id}:xmmp`);
    xmppDebug.log = console.info.bind(console);
    
    if (util.isNullOrUndefined(client) || util.isNullOrUndefined(androidMessages) || !util.isArray(androidMessages) || androidMessages.length == 0) {
        return Promise.resolve();
    }

    xmppDebug("Sending: " + androidMessages.length + " android messages");

    let startTime = Date.now();
    let messageTemplate = this._context.messageTemplate;
    let serializedMessageTemplate = {
        "type": "messages",
        "attributes": {
            "notification-text": messageTemplate.notification_text,
            "ios-title": messageTemplate.ios_title,
            "android-title": messageTemplate.android_title,
            "tags": messageTemplate.tags || [],
            "read": false,
            "saved-to-inbox": messageTemplate.save_to_inbox,
            "content-type": messageTemplate.content_type,
            "website-url": messageTemplate.website_url,
            "deep-link-url": messageTemplate.deeplink_url,
            "timestamp": moment.utc(messageTemplate.timestamp).toISOString(),
            "properties": messageTemplate.properties || {},
            "experience-id": messageTemplate.experience_id
        }
    }

    let self = this;
    let logger = this._server.plugins.logger.logger;
    let librato = this._server.plugins.librato.highResolutionClient;

    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                logger.error(err);
                // We don't want others to cancel
                return resolve();
            }


            return Promise.map(androidMessages, (message) => {
                let notification = new fcmCCS.Notification({
                   data: { message: util._extend(serializedMessageTemplate, { id: message.message._id.toString() }), _rover: true }
                });

                return new Promise((resolve, reject) => {
                    client.send(notification, message.device.token, function(err, response) {
                        if (err) {
                            return resolve({ failed: message, error: err.toString() });
                        }

                        if (response.error) {
                            librato.measure("fcm.notifications.failed", 1, { source: LIBRATO_SOURCE });
                            let errorMessage = response.description || response.error;
                            if (errorMessage == "BAD_REGISTRATION" || errorMessage == "DEVICE_UNREGISTERED") {
                                self._removeTokenFromDevice(message.customer, message.device, (err) => {
                                    if (err) {
                                        console.warn(err);
                                    }

                                    return resolve({ failed: message, error: errorMessage });
                                });
                            } else {
                                return resolve({ failed: message, error: errorMessage });
                            }
                        } else if (response.registration_id) {
                            librato.measure("fcm.notifications.sent", 1, { source: LIBRATO_SOURCE });
                            // The token has changed for some reason we weren't in sync
                            // remove the token from this device
                            
                            self._removeTokenFromDevice(message.customer, message.device, (err) => {
                                if (err) {
                                    console.warn(err);
                                }

                                return resolve({ sent: message });
                            });
                        } else {
                            librato.measure("fcm.notifications.sent", 1, { source: LIBRATO_SOURCE });
                            return resolve({ sent: message });
                        }
                    });
                });
            }).then(results => {
                
                xmppDebug("Finished sending android messages");

                client.shutdown();

                let totalTime = Date.now() - startTime;
                let currentTime = moment.utc(new Date()).unix();
                let accountId = this._context.account.id;

                xmppDebug("Capturing notification(sent/failed) events");

                results.forEach(result => {

                    if (!util.isNullOrUndefined(result) && !util.isNullOrUndefined(result.failed)) {
                        let messageIndex = result.failed;
                        let customer = messageIndex.customer;
                        let device = messageIndex.device;
                        let message =  messageIndex.message;
                        let errors = [ result.error ];

                        this._notificationsFailed += 1;

                        RoverEvent.notificationFailed(accountId, customer, device, message, this._context.messageTemplate, errors, currentTime);
                        

                    } else if(!util.isNullOrUndefined(result) && !util.isNullOrUndefined(result.sent)) {
                        let messageIndex = result.sent;
                        let customer = messageIndex.customer;
                        let device = messageIndex.device;
                        let message =  messageIndex.message;

                        this._notificationsSent += 1;

                        RoverEvent.notificationSent(accountId, customer, device, message, this._context.messageTemplate, currentTime);
                    }
                });

                xmppDebug("Finished capturing notification(sent/failed) events");

                librato.measure("fcm.notifications.sent.time", totalTime / androidMessages.length, { source: LIBRATO_SOURCE });

                return resolve();
                
            }).catch(err => {
                xmppDebug("Finished sending android messages");
                client.shutdown();
                console.warn(err);
                return resolve();
            })
        });
    });
    

};

JobProcessor.prototype._sendAndroidNotifications = function(client, androidMessages) {

    let fcmHttpDebug = require('debug')(`job:${this._id}:fcmhttp`);
    fcmHttpDebug.log = console.info.bind(console);

    if (util.isNullOrUndefined(client) || util.isNullOrUndefined(androidMessages) || !util.isArray(androidMessages) || androidMessages.length == 0) {
        return Promise.resolve();
    }

    fcmHttpDebug("Sending: " + androidMessages.length + " android messages");

    let logger = this._server.plugins.logger.logger;
    let librato = this._server.plugins.librato.highResolutionClient;

    let startTime = Date.now();

    let messageTemplate = this._context.messageTemplate;
    let serializedMessageTemplate = {
        "type": "messages",
        "attributes": {
            "notification-text": messageTemplate.notification_text,
            "ios-title": messageTemplate.ios_title,
            "android-title": messageTemplate.android_title,
            "tags": messageTemplate.tags || [],
            "read": false,
            "saved-to-inbox": messageTemplate.save_to_inbox,
            "content-type": messageTemplate.content_type,
            "website-url": messageTemplate.website_url,
            "deep-link-url": messageTemplate.deeplink_url,
            "timestamp": moment.utc(messageTemplate.timestamp).toISOString(),
            "properties": messageTemplate.properties || {},
            "experience-id": messageTemplate.experience_id
        }
    }

    return Promise.map(androidMessages, (message) => {
        let notification = new fcm.Message({
           data: { message: util._extend(serializedMessageTemplate, { id: message.message._id.toString() }), _rover: true }
        });
        
        return new Promise((resolve, reject) => {

            /*
                { multicast_id: 8496848195191901000, success: 0, failure: 1, canonical_ids: 0, results: [ { error: 'NotRegistered' } ] }
             */

            let self = this;

            client.send(notification, { to: message.device.token }, function(err, response) {
                if (err) {
                    return resolve({ failed: message, error: err.toString() });
                }

                if (response.failure == 1) {
                    librato.measure("fcm.notifications.failed", 1, { source: LIBRATO_SOURCE });
                    let errorMessage = util.isArray(response.results) && !util.isNullOrUndefined(response.results[0].error) ? response.results[0].error : "Unknown";
                    
                    if (errorMessage == "InvalidRegistration" || errorMessage == "NotRegistered") {
                        self._removeTokenFromDevice(message.customer, message.device, (err) => {
                            if (err) {
                                console.warn(err);
                            }

                            return resolve({ failed: message, error: errorMessage });
                        });
                    } else {
                        return resolve({ failed: message, error: errorMessage });
                    }

                } else if (response.canonical_ids == 1) {
                     librato.measure("fcm.notifications.sent", 1, { source: LIBRATO_SOURCE });
                    // The token has changed for some reason we weren't in sync
                    // remove the token from this device
                    
                    self._removeTokenFromDevice(message.customer, message.device, (err) => {
                        if (err) {
                            console.warn(err);
                        }

                        return resolve({ sent: message });
                    });

                } else {
                    librato.measure("fcm.notifications.sent", 1, { source: LIBRATO_SOURCE });
                    return resolve({ sent: message });
                }
            });
        });
    }, { concurrency: 100 }).then(results => {

        fcmHttpDebug("Finished sending android messages");

        let totalTime = Date.now() - startTime;
        let currentTime = moment.utc(new Date()).unix();
        let accountId = this._context.account.id;

        fcmHttpDebug("Capturing notification(sent/failed) events");

        results.forEach(result => {

            if (!util.isNullOrUndefined(result) && !util.isNullOrUndefined(result.failed)) {
                let messageIndex = result.failed;
                let customer = messageIndex.customer;
                let device = messageIndex.device;
                let message =  messageIndex.message;
                let errors = [ result.error ];

                this._notificationsFailed += 1;

                RoverEvent.notificationFailed(accountId, customer, device, message, this._context.messageTemplate, errors, currentTime);
                

            } else if(!util.isNullOrUndefined(result) && !util.isNullOrUndefined(result.sent)) {
                let messageIndex = result.sent;
                let customer = messageIndex.customer;
                let device = messageIndex.device;
                let message =  messageIndex.message;

                this._notificationsSent += 1;

                RoverEvent.notificationSent(accountId, customer, device, message, this._context.messageTemplate, currentTime);
            }
        });

        fcmHttpDebug("Finished capturing notification(sent/failed) events");

        librato.measure("fcm.notifications.sent.time", totalTime / androidMessages.length, { source: LIBRATO_SOURCE });

        return Promise.resolve();
    });
};

JobProcessor.prototype._sendIOSNotifications = function(client, topic, iosMessages) {

    let apnsDebug = require('debug')(`job:${this._id}:apns:${topic}`);
    apnsDebug.log = console.info.bind(console);

    if (util.isNullOrUndefined(client) || util.isNullOrUndefined(iosMessages) || !util.isArray(iosMessages) || iosMessages.length == 0) {
        return Promise.resolve();
    }

    apnsDebug("Sending: " + iosMessages.length + " ios notifications");

    let logger = this._server.plugins.logger.logger;
    let librato = this._server.plugins.librato.highResolutionClient;

    let startTime = Date.now();

    let messageTemplate = this._context.messageTemplate;
    let serializedMessageTemplate = {
        "type": "messages",
        "attributes": {
            "notification-text": messageTemplate.notification_text,
            "ios-title": messageTemplate.ios_title,
            "android-title": messageTemplate.android_title,
            "tags": messageTemplate.tags || [],
            "read": false,
            "saved-to-inbox": messageTemplate.save_to_inbox,
            "content-type": messageTemplate.content_type,
            "website-url": messageTemplate.website_url,
            "deep-link-url": messageTemplate.deeplink_url,
            "timestamp": moment.utc(messageTemplate.timestamp).toISOString(),
            "properties": messageTemplate.properties || {},
            "experience-id": messageTemplate.experience_id
        }
    }

    return Promise.map(iosMessages, (message) => {

        let notification = new apn.Notification({
            aps: {
                sound: 'default',
                alert: messageTemplate.notification_text
            },
            payload: { _rover: true, data: util._extend(serializedMessageTemplate, { id: message.message._id.toString() }) },
            priority: 10
        });

        notification.topic = topic;

        return client.send(notification, message.device.token).then(result => {

            if (util.isNullOrUndefined(result)) {
                librato.measure("apns.notifications.failed", 1, { source: LIBRATO_SOURCE });
                return Promise.resolve({ failed: message, error: "unknown"});
            } else if (util.isArray(result.sent) && result.sent.length > 0) {
                librato.measure("apns.notifications.sent", 1, { source: LIBRATO_SOURCE });
                return Promise.resolve({ sent: message });
            } else if (util.isArray(result.failed) && result.failed.length > 0) {
                librato.measure("apns.notifications.failed", 1, { source: LIBRATO_SOURCE });
                let error = (util.isNullOrUndefined(result.failed[0]) || util.isNullOrUndefined(result.failed[0].response) || util.isNullOrUndefined(result.failed[0].response.reason)) ? "unknown" : result.failed[0].response.reason;
                if (error == "Unregistered" || error == "BadDeviceToken" || error == "DeviceTokenNotForTopic") {
                    this._removeTokenFromDevice(message.customer, message.device, (err) => {
                        if (err) {
                            console.warn(err);
                        }

                        return Promise.resolve({ failed: message, error: error });
                    });
                } else {
                    return Promise.resolve({ failed: message, error: error });
                }
                
            } else {
                return Promise.resolve({});
            }
        })
        .catch(err => {
            console.warn(err);
            return Promise.resolve({});
        });

        // TODO: 
        // update concurrency when core node http2 is merged
    },{ concurrency: APNS_CONCURRENCY }).then(results => {

        apnsDebug("Finished sending ios notifications");

        let totalTime = Date.now() - startTime;

        let accountId = this._context.account.id;
        let currentTime = moment.utc(new Date()).unix();

        apnsDebug("Capturing notification(sent/failed) events");

        results.forEach(result => {
            if (!util.isNullOrUndefined(result) && !util.isNullOrUndefined(result.failed)) {
                let messageIndex = result.failed;
                let customer = messageIndex.customer;
                let device = messageIndex.device;
                let message =  messageIndex.message;
                let errors = [ result.error ];

                this._notificationsFailed += 1;

                RoverEvent.notificationFailed(accountId, customer, device, message, this._context.messageTemplate, errors, currentTime);

            } else if(!util.isNullOrUndefined(result) && !util.isNullOrUndefined(result.sent)) {
                let messageIndex = result.sent;
                let customer = messageIndex.customer;
                let device = messageIndex.device;
                let message =  messageIndex.message;

                this._notificationsSent += 1;

                RoverEvent.notificationSent(accountId, customer, device, message, this._context.messageTemplate, currentTime);
            }
        });

        apnsDebug("Finished capturing notification(sent/failed) events");

        librato.measure("apns.notifications.sent.time", totalTime / iosMessages.length, { source: LIBRATO_SOURCE });
        
        return Promise.resolve();
    }).catch(err => { console.log(err);});
};

JobProcessor.prototype._updateStats = function(first_argument) {
    let messageTemplateId = this._context.messageTemplate.id;

    this._debug("Updating message stats");

    if (util.isNullOrUndefined(messageTemplateId)) {
        this._debug("Finished updating message stats");
        return Promise.resolve();
    }

    let totalDelivered = 0;
        
    if (!util.isNullOrUndefined(this._messagesIndex) && util.isArray(this._messagesIndex)) {
        totalDelivered = this._messagesIndex.length;
    }

    let counterUpdates = {};

    counterUpdates["total_notifications_sent"] = this._notificationsSent;
    counterUpdates["total_notifications_failed"] = this._notificationsFailed;
    counterUpdates["total_delivered"] = totalDelivered;
    counterUpdates["total_audience_size"] = this._customers.length;

    let methods = this._server.methods;

    return new Promise((resolve, reject) => {
        methods.messageTemplateStats.update(messageTemplateId, { "$inc": counterUpdates }, (err, respone) => {
            if (err) {
                this._debug("Failed updating message stats");
                return reject(new JobError(err.message, false));
            }

            this._debug("Finished updating message stats");
            this.updateState(JOB_STATE._updateStats);
            return resolve();
        });
    });
};

JobProcessor.prototype._generateMessage = function(customer, timestamp) {
    let doc = {
        _id: new this._server.connections.mongodb.ObjectId(),
        message_template_id: this._context.messageTemplate.id,
        customer_id: customer._id,
        read: false,
        viewed: false,
        saved_to_inbox: this._context.messageTemplate.save_to_inbox,
        timestamp: timestamp,
    }

    if (this._context.messageTemplate.save_to_inbox == false) {
        util._extend(doc, { expires_at: moment.utc(timestamp).add(1, 'month').format() } );
    }

    return doc;
};

JobProcessor.prototype._removeTokenFromDevice = function(customer, device, callback) {
    // Now an NO-OP
    setImmediate(function() {
        return callback()   
    })
};

JobProcessor.prototype.cleanup = function() {
    this._customers = [];
    this._messagesIndex = [];


    if (global.gc) {
        this._debug("Cleaning up");
        let memoryUsage = process.memoryUsage().heapUsed;
        
        global.gc();

        let memoryFreed = ((memoryUsage - process.memoryUsage().heapUsed) / 1000000).toFixed(2);
        this._debug("Finished GC, freed: " + memoryFreed + " MB");
    }
};

module.exports = JobProcessor;

