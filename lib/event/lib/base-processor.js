var Promise = require('bluebird');

const util = require('util');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('[BaseProcessor]');
const Config = require('../../../config');
const EventProcessor = require('./event-processor');
const async = require('async');
const SegmentFilter = require('@rover/segment-filter');
const emptyArray = Object.freeze([]);

logger.setLevel(Config.get('/log/level'));

const INBOX_KEY_PREFIX = "inbox_";
const RATE_LIMIT_KEY_PREFIX = "msgrl_";
const BACKGROUND_JOBS_EXCHANGE = 'background_jobs';
const MESSAGE_NOTIFICATIONS_ROUTING_KEY = 'send_message_notifications';

let internals = {};

internals.parseGenerationTime = function(timestamp) {
    if (util.isNullOrUndefined(timestamp)) {
        return moment.utc();
    } else {
        return moment(timestamp);
    }
};


class BaseProcessor {

    constructor(args) {
        this._server = args.server;
        this._input = args.input;
        this._account = args.account;
        this._customer = util._extend({}, args.customer);
        this._device = util._extend({}, args.device);
        this._eventId = 0;

        this._generationTime = internals.parseGenerationTime(this._input.time);

        this._object = this._input.object
        this._action = this._input.action
        this._errors = this._input.errors;
        // raw is input minus
        this._rawInput = Object.assign(this._input);
        delete this._rawInput["object"];
        delete this._rawInput["action"];
        delete this._rawInput["errors"];
        delete this._rawInput["time"];
    }

    utcUnixTimestamp() {
        return this._generationTime.utc().unix();
    }

    unixTimestamp() {
        return this._generationTime.unix();
    }

    getTransactionName() {
        return `events/${this._object}/${this._action}`;
    }

    valid() {
        return [this._generationTime, this._object, this._action].every(required => !util.isNullOrUndefined(required));
    }

    shouldProcessEvent(callback) {
        return callback(true);
    }

    process(callback) {
        return callback();
    }

    beforeProcessed(next) {
        return next();
    }

    afterProcessed(next) {
        const librato = this._server.plugins.librato.client;
        librato.measure(`events.${this._object}.${this._action}`, 1 , { source: `account_${this._account.id}`});
        return next();
    }

    captureAnalytics() {
        let methods = this._server.methods;
        methods.analytics.capture(this);
    }

    getMessages(callback) {
        return callback(null, emptyArray);
    }

    filterMessages(messageTemplates, callback) {
        this.filterMessagesBySegment(messageTemplates, (err, filteredMessageTemplates) => {
            if (err) {
                return callback(err);
            }

            this.filterMessagesByRateLimits(filteredMessageTemplates, (err, rateLimitedMessageTemplates) => {
                if (err) {
                    return callback(err);
                }
                
                return callback(null, rateLimitedMessageTemplates);
            });
        });
    }

    filterMessagesBySegment(messageTemplates, callback) {
        if (util.isNullOrUndefined(messageTemplates) || messageTemplates.length == 0) {
            return callback(null, []);
        }

        let server = this._server;
        let methods = server.methods;

        Promise.map(messageTemplates, (messageTemplate) => new Promise((resolve, reject) => {
            
            if (util.isNullOrUndefined(messageTemplate.customer_segment_id)) {
                return resolve(messageTemplate);
            }

            // this message template has a segment
            
            methods.customerSegment.findById(messageTemplate.customer_segment_id, (err, customerSegment) => {
                if (err) {
                    logger.error(err);
                    return resolve(null);
                }

                let segment = new SegmentFilter(customerSegment.filters);
                segment.withinSegment(this._customer, this._device, (failure) => {
                    if (failure) {
                        return resolve(null);
                    }

                    return resolve(messageTemplate);
                });
            });

        })).then(messageTemplatesToDeliver => {
            const filteredMessageTemplates = messageTemplatesToDeliver.filter(message => { return !util.isNullOrUndefined(message)});
            return callback(null, filteredMessageTemplates);
        }).catch(err => {
            return callback(err);
        });
    }

    filterMessagesByRateLimits(messageTemplates, callback) {

        if (util.isNullOrUndefined(messageTemplates) || messageTemplates.length == 0) {
            return callback(null, []);
        }

        let server = this._server;
        let methods = server.methods;
        let accountLimits = this._account.message_limits || [];

        let redis = server.connections.redis.client;

        Promise.map(messageTemplates, (messageTemplate) => new Promise((resolve, reject) => {
            
            methods.rateLimit.withinLimit(this._customer, messageTemplate, this._account.message_limits, (err, success) => {
                if (err) {
                    logger.error(err);
                    return resolve();
                }

                if (success == true) {
                    return resolve(messageTemplate);   
                } else {
                     return resolve();
                }
                
            });
        })).then(messageTemplatesToDeliver => {
            const filteredMessageTemplates = messageTemplatesToDeliver.filter(message => { return !util.isNullOrUndefined(message)});
            return callback(null, filteredMessageTemplates);
        }).catch(err => {
            return callback(err);
        });
    }

    deliverMessages(messageTemplates, callback) {
        if (util.isNullOrUndefined(messageTemplates) || messageTemplates.length == 0) {
            return callback(null, []);
        }

        let server = this._server;
        let methods = server.methods;
        let redis = server.connections.redis.client;
        let rabbitMQChannel = server.connections.rabbitmq.channel;
        // let mongo = server.connections.mongodb.client;
        let ObjectId = server.connections.mongodb.ObjectId;

        let messages = messageTemplates.map((messageTemplate) => {
            let message = {
                _id: new ObjectId(),
                customer_id: this._customer._id,
                message_template_id: messageTemplate.id,
                read: false,
                viewed: false,
                saved_to_inbox: messageTemplate.save_to_inbox,
                timestamp: moment.utc(new Date).toDate(),
            }

            if (messageTemplate.save_to_inbox == false) {
                message.expire_at = moment.utc(new Date).add(1, 'month').toDate();
            }

            return message;
        });

        let accountLimits = this._account.message_limits || [];


        

        methods.message.bulkInsert(messages, (err, insertedMessages) => {
            if (err) {
                logger.error(err);
                return callback();
            }


            if (!util.isNullOrUndefined(this._device.token) && this._device.token !== "") {
                let pushPayload = {
                    customer: this._customer,
                    serialized_messages: insertedMessages,
                    device_ids_filter: [ this._device._id ]
                };
                logger.info(util.format("%s %j", "Published:", pushPayload));
                rabbitMQChannel.publish(BACKGROUND_JOBS_EXCHANGE, MESSAGE_NOTIFICATIONS_ROUTING_KEY, new Buffer(JSON.stringify(pushPayload)));
            }

            let inboxMessages = insertedMessages.filter(message => { return message.saved_to_inbox == true });

            let messageTemplateStatPromises = messageTemplates.map(messageTemplate => new Promise((resolve, reject) => {
                methods.messageTemplateStats.update(messageTemplate.id, { "$inc": { "total_delivered": 1 }}, (err, response) => {
                    if (err) {
                        logger.error(err);
                    }

                    return resolve();
                });
            }));

            let rateLimitPromises = messageTemplates.map(messageTemplate => new Promise((resolve, reject) => {
                methods.rateLimit.update(this._customer, messageTemplate, this._account.message_limits, (err) => {
                    if (err) {
                        logger.error(err);
                    }
                    return resolve();
                })
            }));

            let messageEventPromises = inboxMessages.map(message => {

                let inboxKey = INBOX_KEY_PREFIX + message.customer_id.toString();

                let args = {
                    server: this._server,
                    customer: this._customer,
                    device: this._device,
                    account: this._account,
                    input: {
                        object: "message",
                        action: "added-to-inbox",
                        message: message
                    }
                };
                
                let event = new EventProcessor.map(args);

                return new Promise((resolve, reject) => {
                    methods.inbox.addMessage(this._customer, message, (err, success) => {
                        if (err) {
                            logger.error(err);
                            return resolve();
                        }

                        event.process((err, processedEvent) => {
                            if (err) {
                                logger.error(err);
                            }
                            return resolve();
                        });
                    });
                });
            });
            
            Promise.all(messageEventPromises.concat(rateLimitPromises).concat(messageTemplateStatPromises)).then(() => {
                methods.customer.update(this._customer._id, { "$set": { "inbox_updated_at": moment.utc(new Date).toDate() }}, (err) => {
                    if (err) {
                        logger.error(err);
                    }
                    return callback()
                });
            }).catch(err => {
                logger.error(err);
                return callback()
            });
        });
    }

    toRecord() {
        let event = {
            event: {
                id: this._eventId,
                object: this._object,
                action: this._action,
                timestamp: moment(this._generationTime).utc().unix(),
                source: this._source,
                input: JSON.stringify(this._rawInput),
                errors: this._errors
            },
            customer: {
                id: this._customer._id.toString(),
                identifier: this._customer.identifier,
                first_name: this._customer.first_name,
                last_name: this._customer.last_name,
                email: this._customer.email,
                age: this._customer.age,
                gender: this._customer.gender,
                phone_number: this._customer.phone_number,
                tags: this._customer.tags
            }
        };

        if (this._device) {
            let deviceEventAttributes = {
                device: {
                    id: this._device._id,
                    token: this._device.token,
                    locale_lang: this._device.locale_lang,
                    locale_region: this._device.locale_region,
                    time_zone: this._device.time_zone,
                    sdk_version: this._device.sdk_version,
                    platform: this._device.platform,
                    os_name: this._device.os_name,
                    os_version: this._device.os_version,
                    model: this._device.model,
                    manufacturer: this._device.manufacturer,
                    carrier: this._device.carrier,
                    app_identifier: this._device.app_identifier,
                    background_enabled: this._device.background_enabled,
                    notifications_enabled: this._device.notifications_enabled,
                    bluetooth_enabled: this._device.bluetooth_enabled,
                    location_monitoring_enabled: this._device.location_monitoring_enabled,
                    aid: this._device.aid
                }
            }

            if (util.isObject(this._device.location)) {
                let location = this._device.location
                deviceEventAttributes.device["location"] = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: Math.floor(location.accuracy)
                }
            }

            event = util._extend(event, deviceEventAttributes);
        }

        return event;
    }

    toResponse() {
        return {
            data: {
                type: 'events',
                id: this._eventId,
                attributes: {
                    object: this._object,
                    action: this._action,
                    timestamp: this._generationTime
                }
            }
        }
    }

    toDroppedResponse() {
        return {
            data: {
                type: 'events',
                id: this._eventId,
                attributes: {
                    object: this._object,
                    action: this._action,
                    timestamp: this._generationTime,
                    dropped: true
                }
            }
        }
    }   
}

module.exports = BaseProcessor;