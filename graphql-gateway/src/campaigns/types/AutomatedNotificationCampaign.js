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

import {
    Campaign,
    NotificationCampaign,
    SegmentableCampaign
} from '../interfaces'

import {
    campaignStatus,
    campaignType,
    notificationAttachmentType,
    notificationTapBehaviorType,
    notificationTapPresentationType,
    segmentCondition
} from './definitions'
import PredicateAggregate from '../../segments/PredicateAggregate'

const AutomatedNotificationCampaign = new GraphQLObjectType({
    name: 'AutomatedNotificationCampaign',
    interfaces: () => [Campaign, NotificationCampaign, SegmentableCampaign],
    isTypeOf: ({ campaignType }) =>
        campaignType === 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION',
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
            type: notificationTapBehaviorType
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
        // AUTOMATED ATTRIBUTES
        automatedMonday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Mondays if true'
        },
        automatedTuesday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Tuesdays if true'
        },
        automatedWednesday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Wednesdays if true'
        },
        automatedThursday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Thursdays if true'
        },
        automatedFriday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Fridays if true'
        },
        automatedSaturday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Saturdays if true'
        },
        automatedSunday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Sundays if true'
        },
        automatedStartDate: {
            type: GraphQLString,
            description: 'Start date of the Campaign'
        },

        automatedEndDate: {
            type: GraphQLString,
            description: 'End date of the Campaign'
        },
        automatedStartTime: {
            type: GraphQLInt,
            description: 'Time in minutes since midnight to start the Campaign'
        },
        automatedEndTime: {
            type: GraphQLInt,
            description: 'Time in minutes since midnight to end the Campaign'
        },
        automatedTimeZone: {
            type: GraphQLString,
            description: ''
        },
        automatedUseLocalDeviceTime: {
            type: GraphQLBoolean,
            description: 'Campaign automation rules apply to local device time'
        },
        automatedEventName: {
            type: GraphQLString,
            description: 'Name of Event that triggers Campaign'
        },
        automatedEventPredicates: {
            type: new GraphQLNonNull(new GraphQLList(PredicateAggregate)),
            description: 'Create an Audience query inside Campaigns App'
        },
        //SEGMENT ATTRIBUTES
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

export default AutomatedNotificationCampaign
