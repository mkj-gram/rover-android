import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLList,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { NotificationAttachment } from './Notification'
import { PredicateAggregate } from './Predicate'

export const AutomatedNotificationCampaign = new GraphQLObjectType({
    name: 'AutomatedNotificationCampaign',
    interfaces: () => [Campaign, NotificationCampaign, SegmentableCampaign],
    isTypeOf: ({ campaignType }) => campaignType === 'AUTOMATED_NOTIFICATION',
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
            type: new GraphQLNonNull(CampaignType),
            description: 'Type of the Campaign'
        },
        campaignStatus: {
            type: new GraphQLNonNull(CampaignStatus),
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
        notificationAttachment: {
            type: NotificationAttachment,
            description: 'Rich media attachment (image, video or audio clip)'
        },
        notificationTapBehaviorType: {
            type: NotificationTapBehaviorType
        },
        notificationTapPresentationType: {
            type: NotificationTapPresentationType,
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
            type: SegmentCondition,
            description: 'Include any or all segments'
        }
    })
})

const Campaign = new GraphQLInterfaceType({
    name: 'Campaign',
    description: 'TBD',
    fields: () => ({
        campaignId: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Campaign Identifier'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Name of the Campaign'
        },
        campaignType: {
            type: CampaignType,
            description: 'Type of the Campaign'
        },
        campaignStatus: {
            type: CampaignStatus,
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
        }
    })
})

const CampaignStatus = new GraphQLEnumType({
    name: 'CampaignStatus',
    values: {
        DRAFT: {},
        PUBLISHED: {},
        ARCHIVED: {}
    }
})

const CampaignType = new GraphQLEnumType({
    name: 'CampaignType',
    values: {
        SCHEDULED_NOTIFICATION: {},
        AUTOMATED_NOTIFICATION: {}
    }
})

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
        notificationAttachment: {
            type: NotificationAttachment,
            description: 'Rich media attachment (image, video or audio clip)'
        },
        notificationTapBehaviorType: {
            type: NotificationTapBehaviorType,
            description: 'Behaviour when notification is tapped'
        },
        notificationTapPresentationType: {
            type: NotificationTapPresentationType,
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

const NotificationTapBehaviorType = new GraphQLEnumType({
    name: 'NotificationTapBehaviorType',
    values: {
        OPEN_APP: {},
        OPEN_EXPERIENCE: {},
        OPEN_DEEP_LINK: {},
        OPEN_WEBSITE: {}
    }
})

const NotificationTapPresentationType = new GraphQLEnumType({
    name: 'NotificationTapPresentationType',
    values: {
        UNKNOWN: {},
        APP: {},
        BROWSER: {}
    }
})

const ScheduledDeliveryStatus = new GraphQLEnumType({
    name: 'ScheduledDeliveryStatus',
    values: {
        UNKNOWN: {},
        SCHEDULED: {},
        INPROGRESS: {},
        FINISHED: {}
    }
})

export const ScheduledNotificationCampaign = new GraphQLObjectType({
    name: 'ScheduledNotificationCampaign',
    interfaces: () => [Campaign, NotificationCampaign, SegmentableCampaign],
    isTypeOf: ({ campaignType }) => campaignType === 'SCHEDULED_NOTIFICATION',
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
            type: new GraphQLNonNull(CampaignType),
            description: 'Type of the Campaign'
        },
        campaignStatus: {
            type: new GraphQLNonNull(CampaignStatus),
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
        notificationAttachment: {
            type: NotificationAttachment,
            description: 'Rich media attachment (image, video or audio clip)'
        },
        notificationTapBehaviorType: {
            type: NotificationTapBehaviorType,
            description: 'Behaviour when notification is tapped'
        },
        notificationTapPresentationType: {
            type: NotificationTapPresentationType,
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
            type: ScheduledType
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
            type: ScheduledDeliveryStatus
        },
        // SEGMENT ATTRIBUTES
        segmentIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
            description: 'List of segments'
        },
        segmentCondition: {
            type: SegmentCondition,
            description: 'Include any or all segments'
        }
    })
})

const ScheduledType = new GraphQLEnumType({
    name: 'ScheduledType',
    values: {
        NOW: {},
        SCHEDULED: {}
    }
})

const SegmentCondition = new GraphQLEnumType({
    name: 'SegmentCondition',
    values: {
        ANY: {},
        ALL: {}
    }
})

const SegmentableCampaign = new GraphQLInterfaceType({
    name: 'SegmentableCampaign',
    description: 'List of Rover Segments to apply to Rover Campaign',
    fields: () => ({
        segmentIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
            description: 'List of segments'
        },
        segmentCondition: {
            type: SegmentCondition,
            description: 'Include any or all segments'
        }
    })
})

export default Campaign
