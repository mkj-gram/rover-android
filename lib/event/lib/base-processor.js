var Promise = require('bluebird');

const util = require('util');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('[BaseProcessor]');
const Config = require('../../../config');
const EventProcessor = require('./event-processor');
const async = require('async');
const SegmentFilter = require('@rover/segment-filter');
const underscore = require('underscore');
const emptyArray = Object.freeze([]);

logger.setLevel(Config.get('/log/level'));

const INBOX_KEY_PREFIX = "inbox_";
const RATE_LIMIT_KEY_PREFIX = "msgrl_";
const BACKGROUND_JOBS_EXCHANGE = 'background_jobs';
const MESSAGE_NOTIFICATIONS_ROUTING_KEY = 'send_message_notifications';

let internals = {};

internals.parseGenerationTime = function(timestamp) {
    let generationTime = moment(timestamp);

    if (generationTime.isValid()) {
        return generationTime
    } else {
        return moment(Date.now())
    }
};

internals.fillMessage = function(message, template) {
    return {
        _id: message._id,
        customer_id: message.customer_id,
        message_template_id: message.message_template_id,
        notification_text: template.notification_text,
        ios_title: template.ios_title || "",
        android_title: template.android_title || "",
        tags: template.tags,
        read: message.read,
        viewed: message.viewed,
        saved_to_inbox: message.saved_to_inbox,
        content_type: template.content_type,
        website_url: template.website_url,
        deeplink_url: template.deeplink_url,
        experience_id: template.experience_id,
        landing_page: template.landing_page_template,
        timestamp: message.timestamp,
        properties: template.properties
    }
};


class BaseProcessor {

    constructor(args) {
        this._server = args.server;
        this._account = args.account;
        this._customer = util._extend({}, args.customer);
        this._device = util._extend({}, args.device);
        this._eventName = args.event.name;
        this._eventId = args.event.id;
        this._trigger_event_id = args.trigger_event_id;


        this._object = args.event.attributes.object;
        this._action = args.event.attributes.action;

        delete args.event.attributes['object']
        delete args.event.attributes['action']
        
        let eventTimestamp = args.event.timestamp || args.event.time;

        this._generationTime = internals.parseGenerationTime(eventTimestamp);

        delete args.event.attributes['time']
        delete args.event.attributes['timestamp']

        this._errors = args.event.attributes.errors;

        delete args.event.attributes['errors'];
       

        this._rawInput = Object.assign(args.event.attributes);
    }

    _getTriggerArguments() {
        return {};
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
        return [this._generationTime, this._eventName].every(required => !util.isNullOrUndefined(required));
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
        messageTemplates = (messageTemplates || []).filter(template => {
            
            if (template.save_to_inbox == false && util.isNullOrUndefined(this._device.token)) {
                return false;
            }

            return true;
        });
        
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

        let triggerArgs = this._getTriggerArguments();

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

            let messageTemplateIndex = underscore.indexBy(messageTemplates, 'id');
            let serializedMessages = insertedMessages.map(message => {
                let template = messageTemplateIndex[message.message_template_id.toString()];
                return internals.fillMessage(message, template);
            });

            if (!util.isNullOrUndefined(this._device.token) && this._device.token !== "") {
                let pushPayload = {
                    customer: this._customer,
                    serialized_messages: serializedMessages,
                    device_ids_filter: [ this._device._id ],
                    trigger_event_id: this._eventId,
                    trigger_arguments: triggerArgs
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
                    trigger_event_id: this._eventId,
                    event: {
                        name: "message added-to-inbox",
                        attributes: {
                            message: message
                        }
                    }
                };
                
                let event = new EventProcessor.map(args);
                event.assignProcessorAttributes(triggerArgs);

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
            event_name: this._eventName,
            event: {
                triggered_event_id: this._trigger_event_id,
                timestamp: moment(this._generationTime).utc().unix(),
                source: this._source,
                attributes: this._rawInput,
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

        let place = this._place;

        if (place) {
            let placeRecord = {
                place: {
                    id: place.id,
                    title: place.title,
                    address: place.address,
                    city: place.city,
                    province: place.province,
                    country: place.country,
                    postal_code: place.postal_code,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    radius: place.radius,
                    tags: place.tags,
                    google_place_id: place.google_place_id,
                    enabled: place.enabled,
                    shared: place.shared,
                    beacon_configurations_count: place.beacon_configurations_count
                }
            }

            event = util._extend(event, placeRecord);
        }

        let beaconConfiguration = this._beaconConfiguration;

        if (beaconConfiguration) {
            let beaconConfigurationRecord = {
                configuration: {
                    id: beaconConfiguration.id,
                    place_id: beaconConfiguration.place_id,
                    title: beaconConfiguration.title,
                    protocol: beaconConfiguration.protocol,
                    tags: beaconConfiguration.tags,
                    enabled: beaconConfiguration.enabled,
                    shared: beaconConfiguration.shared,
                    uuid: beaconConfiguration.uuid,
                    major_number: beaconConfiguration.major,
                    minor_number: beaconConfiguration.minor,
                    namespace: beaconConfiguration.namespace,
                    instance_id: beaconConfiguration.instance_id,
                    url: beaconConfiguration.url
                }
            }

            event = util._extend(event, beaconConfigurationRecord);
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
                    name: this._eventName,
                    timestamp: this._generationTime
                }
            }
        }
    }

    toDroppedResponse() {
        return {
            data: {
                type: 'events',
                id: this._eventName,
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