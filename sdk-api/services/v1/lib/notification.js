const ApiHelpers = require('@rover/apis').Helpers
const NotificationApi = require('@rover/apis').notification.v1.Models
const AuthApi = require('@rover/apis').auth.v1.Models

function buildAuthContext(accountId) {
    const context = new AuthApi.AuthContext()
    context.setAccountId(accountId)
    context.setPermissionScopesList(['internal', 'app:sdk-api'])
    return context
}

let internals = {};

internals.serialize = function(notification) {
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
        timestamp: ApiHelpers.timestampFromProto(notification.getCreatedAt())
    }
}

internals.get = function(device, id, callback) {
    const server = this;
    const client = server.connections.notification.client;
    const request = new NotificationApi.GetNotificationRequest()
    request.setAuthContext(buildAuthContext(device.account_id))
    request.setDeviceId(device.id)
    request.setNotificationId(id)

    client.getNotification(request, function(err, response) {
        if (err) {
            return callback(err)
        }

        if (!response.hasNotification()) {
            return callback(null, null)
        }

        const notification = server.methods.notification.serialize(response.getNotification())
        return callback(null, notification)
    })
}

internals.setReadStatus = function(device, id, isRead, callback) {
    const server = this;
    const client = server.connections.notification.client;

    const request = new NotificationApi.UpdateNotificationReadStatusRequest()
    request.setAuthContext(buildAuthContext(device.account_id))
    request.setDeviceId(device.id)
    request.setNotificationId(id)
    request.setRead(isRead)

    client.updateNotificationReadStatus(request, function(err, response) {
        if (err) {
            return callback(err)
        }

        return callback(null)
    })
}

internals.delete = function(device, id, callback) {
    const server = this;
    const client = server.connections.notification.client;

    const request = new NotificationApi.DeleteNotificationRequest()
    request.setAuthContext(buildAuthContext(device.account_id))
    request.setDeviceId(device.id)
    request.setNotificationId(id)

    client.deleteNotification(request, function(err, response) {
        if (err) {
            return callback(err)
        }

        return callback(null)
    })
}


module.exports = {
    serialize: internals.serialize,
    get: internals.get,
    setReadStatus: internals.setReadStatus,
    delete: internals.delete
}