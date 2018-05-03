'use strict';
const util = require('util');
const keyPrefix = 'inbox_';
const moment = require('moment')
const underscore = require('underscore')
const dasherize = require('dasherize')
const AuthApi = require('@rover/apis').auth.v1.Models
const NotificationApi = require('@rover/apis').notification.v1.Models
const Helpers = require('@rover/apis').Helpers
const internals = {};

function buildAuthContext(accountId) {
    const context = new AuthApi.AuthContext()
    context.setAccountId(accountId)
    context.setPermissionScopesList(['internal', 'app:sdk-api'])
    return context
}

function fetchOldInbox(server, device) {
    const methods = server.methods

    return new Promise(function(resolve, reject) {
        methods.inbox.find(device, function(err, ids) {
            if (err) {
                return reject(err)
            }

            if (ids.length == 0) {
                return resolve([])
            }

            methods.message.findAll(ids, {}, function(err, messages) {
                if (err) {
                    return reject(err)
                }

                const templateIds = Array.from(new Set(messages.map(message => message.message_template_id)))

                methods.messageTemplate.findAll(templateIds, { useCache: true }, function(err, templates) {
                    if (err) {
                        return reject(err)
                    }

                    const templatesById = underscore.indexBy(templates, 'id')


                    const ret = messages.map(function(message) {
                        const template = templatesById[message.message_template_id]
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
                    }).filter(function(message) { return message !== undefined })

                    return resolve(ret)
                })
            })
        })
    })
}



function fetchNewInbox(server, device) {
    const client = server.connections.notification.client
    return new Promise(function(resolve, reject) {
        // const request = new RoverApis
        const request = new NotificationApi.ListNotificationsRequest()
        request.setAuthContext(buildAuthContext(device.account_id))
        request.setDeviceId(device.id)

        client.listNotifications(request, function(err, response) {
            if (err) {
                return reject(err)
            }

            const notifications = response.getNotificationsList().map(function(notification) {

                let content_type = ""
                switch(notification.getTapBehaviorType()) {
                    case NotificationApi.NotificationTapBehaviorType.Enum.OPEN_EXPERIENCE:
                        content_type = "experience"
                        break
                    case NotificationApi.NotificationTapBehaviorType.Enum.OPEN_APP:
                        content_type = "custom"
                        break
                    case NotificationApi.NotificationTapBehaviorType.Enum.OPEN_DEEP_LINK:
                        content_type = "deep-link"
                        break
                    case NotificationApi.NotificationTapBehaviorType.Enum.OPEN_WEBSITE:
                        content_type = "website"
                        break
                    default:
                        content_type = "custom"
                }

                return {
                    id: notification.getId(),
                    notification_text: notification.getBody(),
                    ios_title: notification.getTitle(),
                    android_title: notification.getTitle(),
                    tags: [],
                    read: notification.getIsRead(),
                    saved_to_inbox: notification.getIsNotificationCenterEnabled(),
                    content_type: content_type,
                    website_url: notification.getTapBehaviorUrl(),
                    deep_link_url: notification.getTapBehaviorUrl(),
                    landing_page: {},
                    experience_id: notification.getExperienceId(),
                    properties: {},
                    timestamp: Helpers.timestampFromProto(notification.getCreatedAt())
                }
            })

            return resolve(notifications)
        })
    })
}

internals.fetch = function(device, callback) {
    const server = this;

    Promise.all([fetchOldInbox(server, device), fetchNewInbox(server, device)])
        .then(function(values) {
            const messages = underscore.flatten(values).sort(function(m1, m2) {
                return (moment(m2.timestamp).unix() - moment(m1.timestamp).unix())
            })
            return callback(null, messages)
        })
        .catch(function(err) {
            return callback(err)
        })
   
}

internals.find = function(device, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const inboxKey = internals.getInboxKey(device);

    redis.lrange(inboxKey, 0, -1, (err, response) => {
        if (err) {
            return callback(err, null);
        }

        return callback(null, response);
    });
};

internals.addMessage = function(device, message, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const logger = server.plugins.logger.logger;
    const inboxKey = internals.getInboxKey(device);
    const inboxUpdatedAtKey = internals.getInboxUpdatedAtKey(device)

    logger.debug('Service: [inbox.addMessage] ' + util.format("Key: %s %j", inboxKey, message));

    redis.multi()
        .lpush(inboxKey, message._id.toString())
        .set(inboxUpdatedAtKey, internals.getCurrentUnixTime())
        .exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            return callback(null, replies[0])
        })
};

internals.deleteMessage = function(device, messageId, callback) {
    const server = this;
    const redis = server.connections.redis.inbox.client;
    const logger = server.plugins.logger.logger;
    const inboxKey = internals.getInboxKey(device);
    const inboxUpdatedAtKey = internals.getInboxUpdatedAtKey(device)

    logger.debug('Service: [inbox.deleteMessage] ' + util.format("Key: %s %s", inboxKey, messageId));

    redis.multi()
        .lrem(inboxKey, 1, messageId)
        .set(inboxUpdatedAtKey, internals.getCurrentUnixTime())
        .exec(function(err, replies) {
            if (err) {
                return callback(err)
            }

            return callback(null, replies[0])
        })
};

internals.getCurrentUnixTime = function() {
    return moment.utc().unix()
}

internals.getLastModifiedAt = function(device, callback) {
    const server = this
    const redis = server.connections.redis.inbox.client
    const logger = server.plugins.logger.logger
    const key = internals.getInboxUpdatedAtKey(device)

    redis.get(key, function(err, response) {
        if (err) {
            return callback(err)
        }

        if (response === null) {
            return callback(null, null)
        }

        const date = moment.unix(response).toDate()
        return callback(null, date)
    })
}

internals.updateLastModifiedAt = function(device, time, callback) {
    const server = this
    const redis = server.connections.redis.inbox.client
    const logger = server.plugins.logger.logger
    const key = internals.getInboxUpdatedAtKey(device)

    const unixTime = moment(time).utc().unix()

    redis.set(key, unixTime, function(err, response) {
        if (err) {
            return callback(err)
        }

        return callback()
    })
}


// @private
internals.getInboxKey = (device) => {
    return `${device.account_id}:${device.id}`
};

internals.getInboxUpdatedAtKey = (device) => {
    return internals.getInboxKey(device).concat("_updated_at")
}


module.exports = {
    fetch: internals.fetch,
    find: internals.find,
    addMessage: internals.addMessage,
    deleteMessage: internals.deleteMessage,
    getLastModifiedAt: internals.getLastModifiedAt,
    updateLastModifiedAt: internals.updateLastModifiedAt
}