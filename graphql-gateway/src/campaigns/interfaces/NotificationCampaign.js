import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLEnumType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

import {
    notificationAttachmentType,
    notificationTapBehaviorType,
    notificationTapPresentationType
} from '../types/definitions'

const NotificationCampaign = new GraphQLInterfaceType({
    name: 'NotificationCampaign',
    description: 'Campaign Notification Attributes',
    fields: () => ({
        notificationBody: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Text body of the notification'
        },
        notificationTitle: {
            type: GraphQLString,
            description: 'Title of the notification'
        },
        notificationAttachmentUrl: {
            type: GraphQLString,
            description: 'URL of the notification attachment'
        },
        notificationAttachmentType: {
            type: notificationAttachmentType,
            description: 'Attachment type of the notification'
        },
        notificationTapBehaviorType: {
            type: notificationTapBehaviorType,
            description: 'Behaviour when notification is tapped'
        },
        notificationTapPresentationType: {
            type: notificationTapPresentationType,
            description: 'Present media in app or in browser'
        },
        experienceId: {
            type: GraphQLString,
            description: 'ID of Rover Experience linked from notification tap'
        },
        notificationTapBehaviorUrl: {
            type: GraphQLString,
            description: 'URL linked from notification tap'
        },
        notificationIosContentAvailable: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        notificationIosMutableContent: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        notificationIosSound: {
            type: GraphQLString,
            description: 'Name of iOS notification sound in app'
        },
        notificationIosCategoryIdentifier: {
            type: GraphQLString,
            description: ''
        },
        notificationIosThreadIdentifier: {
            type: GraphQLString,
            description: 'Group notifications together'
        },
        notificationAndroidChannelId: {
            type: GraphQLString,
            description: ''
        },
        notificationAndroidSound: {
            type: GraphQLString,
            description: 'Name of Android notification sound in app'
        },
        notificationAndroidTag: {
            type: GraphQLString,
            description: ''
        },
        notificationExpiration: {
            type: GraphQLInt,
            description: ''
        },
        notificationAttributesMap: {
            type: GraphQLJSON,
            description: 'Key Value pairs attached to notification'
        },
        notificationAlertOptionPushNotification: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'Campaign is delivered via push notification when true'
        },
        notificationAlertOptionNotificationCenter: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description:
                'Campaign is delivered to Rover Notifcation Center when true'
        },
        notificationAlertOptionBadgeNumber: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description:
                'Badge number is increased on delivery when notificationAlertOptionNotificationCenter is true'
        }
    })
})

export default NotificationCampaign
