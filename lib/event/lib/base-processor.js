var Promise = require('bluebird');

const util = require('util');
const moment = require('moment');
const Hoek = require('hoek');
const log4js = require('log4js');
const logger = log4js.getLogger('[BaseProcessor]');
const Config = require('../../../config');
const EventProcessor = require('./event-processor');
const async = require('async');
const SegmentFilter = require('@rover/segment-filter');


logger.setLevel(Config.get('/log/level'));

const INBOX_KEY_PREFIX = "inbox_";
const RATE_LIMIT_KEY_PREFIX = "msgrl_";
const BACKGROUND_JOBS_EXCHANGE = 'background_jobs';
const MESSAGE_NOTIFICATIONS_ROUTING_KEY = 'send_message_notifications';

let internals = {};

internals.parseGenerationTime = function(timestamp) {
    if (util.isNullOrUndefined(timestamp)) {
        return moment.utc().toDate();
    } else {
        return moment(timestamp).utc().toDate();
    }
};


class BaseProcessor {

    constructor(args) {
        this._server = args.server;
        this._input = args.input;
        this._account = args.account;
        this._customer = Hoek.clone(args.customer);
        this._device = Hoek.clone(args.device);
        this._eventId = 0;


        this._generationTime = internals.parseGenerationTime(this._input.timestamp);
        this._object = this._input.object
        this._action = this._input.action
        this._errors = this._input.errors;
        // raw is input minus
        this._rawInput = Hoek.clone(this._input);
        delete this._rawInput["object"];
        delete this._rawInput["action"];
        delete this._rawInput["errors"];
        delete this._rawInput["timestamp"];
    }

    unixTimestamp() {
        return moment(this._generationTime).unix();
    }

    valid() {
        return true;
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
        return next();
    }

    captureAnalytics() {
        let methods = this._server.methods;
        methods.analytics.capture(this);
    }

    getMessages(callback) {
        // base processor doesn't have any messages
        return callback(null, []);
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

        let redis = server.plugins.redis.client;

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
        let redis = server.plugins.redis.client;
        let rabbitMQChannel = server.plugins.rabbitmq.channel;
        // let mongo = server.plugins.mongodb.client;
        let ObjectId = server.plugins.mongodb.ObjectId;

        let messages = messageTemplates.map((messageTemplate) => {
            let message = {
                _id: new ObjectId(),
                customer_id: this._customer._id,
                message_template_id: messageTemplate.id,
                notification_text: messageTemplate.notification_text,
                ios_title: messageTemplate.ios_title || this._account.ios_platform_name || "Rover",
                android_title: messageTemplate.android_title || this._account.android_platform_name || "Rover",
                tags: messageTemplate.tags,
                read: false,
                viewed: false,
                saved_to_inbox: messageTemplate.save_to_inbox,
                content_type: messageTemplate.content_type,
                website_url: messageTemplate.website_url,
                deeplink_url: messageTemplate.deeplink_url,
                experience_id: messageTemplate.experience_id,
                landing_page: messageTemplate.landing_page_template,
                timestamp: moment.utc(new Date).toDate(),
                properties: messageTemplate.properties
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
            
            Promise.all(messageEventPromises.concat(rateLimitPromises)).then(() => {
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
                timestamp: moment(this._generationTime).unix(),
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