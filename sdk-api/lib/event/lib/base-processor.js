var Promise = require('bluebird');

const util = require('util');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('[BaseProcessor]');
const Config = require('../../../config');
const EventProcessor = require('./event-processor');
const async = require('async');
const underscore = require('underscore');
const emptyArray = Object.freeze([]);
const RoverApis = require("@rover/apis")
const audienceClient = require("@rover/audience-client").v1.Client()

logger.setLevel(Config.get('/log/level'));

const INBOX_KEY_PREFIX = "inbox_";
const RATE_LIMIT_KEY_PREFIX = "msgrl_";
const BACKGROUND_JOBS_EXCHANGE = 'background_jobs';
const MESSAGE_NOTIFICATIONS_ROUTING_KEY = 'send_message_notifications';

let internals = {};

internals.underscoreKeys = function(object) {
    if (util.isNullOrUndefined(object)) {
        return {};
    }

    const underscorePayload = {};

    Object.keys(object).forEach(key => {
        let underscoreKey = key.replace(/\-/g, '_');
        let value = object[key];

        if (util.isObject(value)) {
            underscorePayload[underscoreKey] = internals.underscoreKeys(value)
        } else {
            underscorePayload[underscoreKey] = value
        }
    })

    return underscorePayload;
}

internals.parseGenerationTime = function(timestamp) {
    let generationTime = moment.parseZone(timestamp);

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

internals.convertToOldDeviceAttributes = function(device) {
    
    function flattenVersion(version) {
        if (version.major !== null && version.minor !== null && version.revision !== null) {
            return `${version.major}.${version.minor}.${version.revision}`
        }
        
        return null
    }

    const oldDevice = {
        _id: device.id,
        token: device.push_token,
        locale_lang: device.locale_language,
        locale_region: device.locale_region,
        time_zone: device.time_zone,
        sdk_version: flattenVersion(device.sdk_version),
        app_identifier: device.app_namespace,
        platform: device.platform,
        os_name: device.os_name,
        os_version: flattenVersion(device.os_version),
        model: device.device_model,
        manufacturer: device.device_manufacturer,
        carrier: device.carrier_name,
        background_enabled: device.is_background_enabled,
        notifications_enabled: device.push_token_is_active,
        location_monitoring_enabled: device.is_location_monitoring_enabled,
        bluetooth_enabled: device.is_bluetooth_enabled,
        development: device.push_environment === "development",
        test_device: device.is_test_device || false,
        aid: device.advertising_id,
        ip: device.ip
    }

    if (device.location_longitude !== null && device.location_latitude !== null) {
        oldDevice["location"] = {
            longitude: device.location_longitude,
            latitude: device.location_latitude,
            accuracy: device.location_accuracy
        }
    }

    return oldDevice
}


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
        
        this._rawEventTimestamp = args.event.timestamp || args.event.time;

        this._generationTime = internals.parseGenerationTime(this._rawEventTimestamp);

        delete args.event.attributes['time']
        delete args.event.attributes['timestamp']

        this._errors = args.event.attributes.errors;

        delete args.event.attributes['errors'];
       

        this._rawInput = internals.underscoreKeys(args.event.attributes)
    }

    _getTriggerArguments() {
        return {};
    }

    utcUnixTimestamp() {
        return moment(this._generationTime).utc().unix();
    }

    unixTimestamp() {
        return moment(this._generationTime).unix();
    }

    getTransactionName() {
        return `events/${this._object}/${this._action}`;
    }

    valid() {
        if (util.isNullOrUndefined(this._generationTime)) {
             this._validationError = "Event generation time was not provided"
             return false
        }
        if (util.isNullOrUndefined(this._eventName)) {
            this._validationError = "Event type is missing"
            return false
        }

        return true
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
            
            // If this message is not saved to inbox and the device isn't push enabled ski it
            if (template.save_to_inbox == false && this._device.push_token === "") {
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

    // Only called if the dynamic_segment_id has been set
    filterMessageByDynamicSegment(messageTemplate, resolve, reject) {
        let server = this._server;
        let methods = server.methods;


        let profileProto = methods.profile.profileToProto(this._customer)
        let deviceProto = methods.device.deviceToProto(this._device)
        
        let authContext = new RoverApis.auth.v1.Models.AuthContext()
        authContext.setAccountId(this._account.id)

        let request = new RoverApis.audience.v1.Models.IsInDynamicSegmentRequest()
        request.setAuthContext(authContext)
        request.setSegmentId(messageTemplate.dynamic_segment_id)
        request.setProfile(profileProto)
        request.setDevice(deviceProto)


        audienceClient.isInDynamicSegment(request, function(err, response) {
            if (err) {
                logger.error(err)
                return resolve(null)
            }

            return resolve(response.getYes() === true ? messageTemplate : null)
        })
        
    }

    filterMessageByStaticSegment(messageTemplate, resolve, reject) {
        let server = this._server;
        let methods = server.methods;

        methods.staticSegment.withinSegment(messageTemplate.account_id, messageTemplate.static_segment_id, this._customer.identifier, (inSegment) => {
            if (inSegment == true) {
                return resolve(messageTemplate)
            }

            return resolve(null)
        })
    }

    filterMessagesBySegment(messageTemplates, callback) {
        if (util.isNullOrUndefined(messageTemplates) || messageTemplates.length == 0) {
            return callback(null, []);
        }

        Promise.map(messageTemplates, (messageTemplate) => new Promise((resolve, reject) => {
            
            if (messageTemplate.static_segment_id) {
                return this.filterMessageByStaticSegment(messageTemplate, resolve, reject);
            } else if(messageTemplate.dynamic_segment_id) {
                return this.filterMessageByDynamicSegment(messageTemplate, resolve, reject);
            } else {
                return resolve(messageTemplate)
            }

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
                account_id: this._device.account_id,
                device_id: this._device.id,
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

            if (!util.isNullOrUndefined(this._device.push_token) && this._device.push_token !== "") {
                const profile = this._customer
                const device = this._device

                let pushPayload = {
                    customer: {
                        _id: profile.id,
                        account_id: profile.account_id,
                        identifier: profile.identifier,
                        traits: {},
                        tags: profile.tags,
                        devices: [internals.convertToOldDeviceAttributes(device)]
                    },
                    serialized_messages: serializedMessages,
                    device_ids_filter: [ device.id ],
                    trigger_event_id: this._eventId,
                    trigger_arguments: triggerArgs
                };
                logger.info(util.format("%s %j", "Published:", pushPayload));
                rabbitMQChannel.publish(BACKGROUND_JOBS_EXCHANGE, MESSAGE_NOTIFICATIONS_ROUTING_KEY, new Buffer(JSON.stringify(pushPayload)));
            }

            let inboxMessages = serializedMessages.filter(message => { return message.saved_to_inbox == true });

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
                    methods.inbox.addMessage(this._device, message, (err, success) => {
                        if (err) {
                            logger.error("methods.inbox.addMessage", err);
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
                return callback()
            }).catch(err => {
                logger.error(err)
                return callback()
            })

        });
    }

    toRecord() {
        function getCustomerRecord(customer) {
            let record = {}
            Object.assign(record, customer)
            record.account_id = undefined
            record.created_at = undefined
            record.updated_at = undefined
            return record
        }

        let event = {
            event_name: this._eventName,
            event: {
                triggered_event_id: this._trigger_event_id,
                timestamp: moment(this._generationTime).utc().unix(),
                source: this._source,
                attributes: this._rawInput,
                errors: this._errors
            },
            customer: getCustomerRecord(this._customer)
        };

        function flattenVersion(v) {
            if (v === null || v === undefined) {
                return null
            }
            return `${v.major}.${v.minor}.${v.revision}`
        }

        if (this._device) {
            let deviceEventAttributes = {
                device: {
                    id: this._device.id,
                    token: this._device.push_token,
                    locale_lang: this._device.locale_language,
                    locale_region: this._device.locale_region,
                    time_zone: this._device.time_zone,
                    sdk_version: flattenVersion(this._device.sdk_version),
                    platform: this._device.platform,
                    os_name: this._device.os_name,
                    os_version: flattenVersion(this._device.os_version),
                    model: this._device.device_model,
                    manufacturer: this._device.device_manufacturer,
                    carrier: this._device.carrier_name,
                    app_identifier: this._device.app_namespace,
                    background_enabled: this._device.is_background_enabled,
                    notifications_enabled: this._device.push_token_is_active,
                    bluetooth_enabled: this._device.is_bluetooth_enabled,
                    location_monitoring_enabled: this._device.is_location_monitoring_enabled,
                    aid: this._device.advertising_id,
                    ip: this._device.ip
                }
            }

            if (this._device.location_latitude && this._device.location_longitude) {
                deviceEventAttributes.device["location"] = {
                    latitude: this._device.location_latitude,
                    longitude: this._device.location_longitude,
                    accuracy: Math.floor(this._device.location_accuracy)
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

        let gimbalPlace = this._gimbalPlace;

        if (gimbalPlace) {
            let gimbalPlaceRecord = {
                gimbal_place: {
                    id: gimbalPlace.id,
                    title: gimbalPlace.name
                }
            }

            event = util._extend(event, gimbalPlaceRecord)
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