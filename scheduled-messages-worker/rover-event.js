'use strict';

const util = require('util');
const moment = require('moment');
const Config = require('./config');
const EVENT_ID_MAP = {
    "message": {
        "added-to-inbox": 102,
    },
    "notification": {
        "sent": 121,
        "failed": 122
    },
    "rate-limit": {
        "global-limit-exceeded": 141,
        "message-limit-exceeded": 142 
    }
};

const logger = require('fluent-logger').createFluentSender(null, {
    host: Config.get("/cruncher_buffer_client/host"),
    port: Config.get("/cruncher_buffer_client/port"),
    timeout: 3.0,
    reconnectInterval: 600000 // 10 minutes
});

const _dig = (object, keys) => {
    for ( let i = 0; i < keys.length; i++) {
        if (util.isNullOrUndefined(object[keys[i]])) {
            return undefined;
        }
        object = object[keys[i]];
    }
    return object
};

/**
 * @private
 * @method _getEventTagFromAccountId
 * @description converts the account id to a fluentd tag
 * @param  {Integer}
 * @return {String}
 */
const _getEventTagFromAccountId = (accountId) => {
    return `account_${accountId}.event`
};

const _getEventId = (object, action) => {
    return _dig(EVENT_ID_MAP, [object, action]);
};

const _getEventAttributesFromEvent = (object, action, errors, timestamp) => {
    return {
        timestamp: timestamp,
        errors: errors
    }
};

const serializeVersion = (version) => {
    
    if (util.isNullOrUndefined(version)) {
        return undefined;
    }

    let major = version.major;
    let minor = version.minor;
    let revision = version.revision;
    let serializedVersion = `${major}.${minor}`
    if (!util.isNullOrUndefined(revision)) {
        serializedVersion = serializedVersion.concat(`.${revision}`)
    }

    return serializedVersion;
};

const _getEventAttributesFromCustomer = (customer) => {
    return {
        id: customer._id.toString(),
        identifier: customer.identifier,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        age: customer.age,
        gender: customer.gender,
        phone_number: customer.phone_number,
        tags: customer.tags
    }
};

const _getEventAttributesFromDevice = (device) => {
    
    if (util.isNullOrUndefined(device)) {
        return null;
    }

    if (util.isNullOrUndefined(device._id)) {
        // console.warn("Device._id is missing");
        return null;
    }

    let attributes = {
        id: device._id.toString(),
        token: device.token,
        locale_lang: device.locale_lang,
        locale_region: device.locale_region,
        time_zone: device.time_zone,
        sdk_version: serializeVersion(device.sdk_version),
        platform: device.platform,
        os_name: device.os_name,
        os_version: serializeVersion(device.os_version),
        model: device.model,
        manufacturer: device.manufacturer,
        carrier: device.carrier,
        app_identifier: device.app_identifier,
        background_enabled: device.background_enabled,
        notifications_enabled: device.notifications_enabled,
        bluetooth_enabled: device.bluetooth_enabled,
        location_monitoring_enabled: device.location_monitoring_enabled,
        development: device.development,
        aid: device.aid,
        beacon_regions_monitoring: JSON.stringify(device.beacon_regions_monitoring),
        geofence_regions_monitoring: JSON.stringify(device.geofence_regions_monitoring),
    }

    if (!util.isNullOrUndefined(device.location)) {
        attributes["location"] = {
            latitude: device.location.lat,
            longitude: device.location.lon,
        }
    }

    return attributes;
};

const _getEventAttributesFromMessage = (message, messageTemplate) => {

    if (util.isNullOrUndefined(message)) {
        return undefined;
    }

    return {
        id: message._id.toString(),
        message_template_id: message.message_template_id,
        notification_text: messageTemplate.notification_text,
        ios_title: messageTemplate.ios_title,
        android_title: messageTemplate.android_title,
        ios_sound_file: messageTemplate.ios_sound_file,
        android_sound_file: messageTemplate.android_sound_file,
        read: message.read,
        viewed: message.viewed,
        saved_to_inbox: message.saved_to_inbox,
        content_type: messageTemplate.content_type,
        website_url: messageTemplate.website_url,
        deeplink_url: messageTemplate.deeplink_url,
        timestamp: moment(message.timestamp).unix(),
        landing_page: null, // JSON.stringify(message.landing_page),
        properties: JSON.stringify(messageTemplate.properties)
    }
};

const capture = (accountId, object, action, customer, device, message, messageTemplate, errors, timestamp) => {

    if (_getEventId(object, action) == null) {
        return;
    }

    if (util.isNullOrUndefined(customer)) {
        console.warn("RoverEvent: customer undefined");
        return;
    }

    if (util.isNullOrUndefined(device)) {
        // Can be null when adding to a identified customer's inbox
        // who no longer has a device
        // console.warn("RoverEvent: device undefined");
    }

    if (util.isNullOrUndefined(message)) {
        console.warn("RoverEvent: message undefined");
        return;
    }

    if (util.isNullOrUndefined(messageTemplate)) {
        console.warn("RoverEvent: messageTemplate undefined");
        return;
    }

    if (util.isNullOrUndefined(timestamp)) {
        timestamp = moment(new Date()).unix();
    }

    if (!util.isNumber(timestamp)) {
        timestamp = moment(timestamp).unix();
    }

    
    let event = {
        event_name: `${object} ${action}`,
        event: _getEventAttributesFromEvent(object, action, errors, timestamp),
        customer: _getEventAttributesFromCustomer(customer),
        device: _getEventAttributesFromDevice(device),
        message: _getEventAttributesFromMessage(message, messageTemplate)
    }
    
    logger.emit(_getEventTagFromAccountId(accountId), event, timestamp);

    return;
};

const addedToInbox = (accountId, customer, message, messageTemplate, timestamp) => {
    
    let object = "message";
    let action = "added-to-inbox"

    return capture(accountId, object, action, customer, null, message, messageTemplate, [], timestamp);
    
};


const notificationSent = (accountId, customer, device, message, messageTemplate, timestamp) => {
    
    let object = "notification";
    let action = "sent"

    return capture(accountId, object, action, customer, device, message, messageTemplate, [], timestamp);
};


const notificationFailed = (accountId, customer, device, message, messageTemplate, errors, timestamp) => {

    let object = "notification";
    let action = "failed"
    
    return capture(accountId, object, action, customer, device, message, messageTemplate, errors, timestamp);
};


module.exports = {
    addedToInbox: addedToInbox,
    notificationSent: notificationSent,
    notificationFailed: notificationFailed
}