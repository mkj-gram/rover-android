import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { campaign, notification, scheduled, segmentIdList } from '../interfaces'

import {
    campaignType,
    campaignStatus,
    notificationAttachmentType,
    notificationTapBehaviorType,
    notificationTapPresentationType,
    scheduledType,
    segmentCondition,
    scheduledDeliveryStatus
} from './definitions'

const scheduledNotification = new GraphQLObjectType({
    name: 'ScheduledNotificationCampaign',
    interfaces: () => [scheduled, campaign, notification, segmentIdList],
    isTypeOf: ({ campaignType }) =>
        campaignType === 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION',
    fields: () => ({
        // CAMPAIGN ATTRIBUTES
        campaignId: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Campaign Identifier'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Name of the Campaign'
        },
        campaignType: {
            type: new GraphQLNonNull(campaignType),
            description: 'Type of the Campaign'
        },
        campaignStatus: {
            type: new GraphQLNonNull(campaignStatus),
            description: 'Status of the Campaign'
        },
        UIState: {
            type: GraphQLJSON,
            description: 'State object for Campaigns App UI'
        },
        createdAt: {
            type: GraphQLDateTime,
            description: 'Campaign create date'
        },
        updatedAt: {
            type: GraphQLDateTime,
            description: 'Campaign latest update date'
        },
        // NOTIFICATION ATTRIBUTES
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
        },
        // SCHEDULE ATTRIBUTES
        scheduledType: {
            type: scheduledType
        },
        scheduledTimestamp: {
            type: GraphQLDateTime,
            description: 'Timestamp to send scheduled message'
        },
        scheduledTimeZone: {
            type: GraphQLString,
            description: 'Timezone used to parse scheduledTimestamp'
        },
        scheduledUseLocalDeviceTime: {
            type: GraphQLBoolean,
            description: "Use this device's timezone"
        },
        scheduledDeliveryStatus: {
            type: scheduledDeliveryStatus
        },
        // SEGMENT ATTRIBUTES
        segmentIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
            description: 'List of segments'
        },
        segmentCondition: {
            type: segmentCondition,
            description: 'Include any or all segments'
        }
    })
})

export default scheduledNotification
