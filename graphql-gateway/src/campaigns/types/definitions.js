import RoverApis from '@rover/apis'
import { GraphQLEnumType } from 'graphql'

import grpcEnumMap from '../../grpc/grpcEnumMap'

export const campaignStatus = new GraphQLEnumType({
    name: 'CampaignStatusEnum',
    values: {
        CAMPAIGN_STATUS_DRAFT: {},
        CAMPAIGN_STATUS_PUBLISHED: {},
        CAMPAIGN_STATUS_ARCHIVED: {}
    }
})

export const campaignType = new GraphQLEnumType({
    name: 'CampaignTypeEnum',
    values: {
        CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION: {},
        CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION: {}
    }
})

export const notificationAttachmentType = new GraphQLEnumType({
    name: 'NotificationAttachmentType',
    values: {
        NOTIFICATION_ATTACHMENT_TYPE_UNKNOWN: {},
        NOTIFICATION_ATTACHMENT_TYPE_IMAGE: {},
        NOTIFICATION_ATTACHMENT_TYPE_AUDIO: {},
        NOTIFICATION_ATTACHMENT_TYPE_VIDEO: {}
    }
})

export const notificationTapBehaviorType = new GraphQLEnumType({
    name: 'NotificationTapBehaviorType',
    values: {
        NOTIFICATION_TAP_BEHAVIOR_TYPE_UNKNOWN: {},
        NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_APP: {},
        NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_EXPERIENCE: {},
        NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_DEEP_LINK: {}
    }
})

export const notificationTapPresentationType = new GraphQLEnumType({
    name: 'NotificationTapPresentationType',
    values: {
        NOTIFICATION_TAP_PRESENTATION_TYPE_UNKNOWN: {},
        NOTIFICATION_TAP_PRESENTATION_TYPE_IN_APP: {},
        NOTIFICATION_TAP_PRESENTATION_TYPE_IN_BROWSER: {}
    }
})

export const scheduledDeliveryStatus = new GraphQLEnumType({
    name: 'DeliveryStatus',
    values: {
        DELIVERY_STATUS_UNKNOWN: {},
        DELIVERY_STATUS_SCHEDULED: {},
        DELIVERY_STATUS_INPROGRESS: {},
        DELIVERY_STATUS_FINISHED: {}
    }
})

export const scheduledType = new GraphQLEnumType({
    name: 'ScheduledType',
    values: {
        SCHEDULED_TYPE_UNKNOWN: {},
        SCHEDULED_TYPE_NO: {},
        SCHEDULED_TYPE_SCHEDULED: {}
    }
})

export const segmentCondition = new GraphQLEnumType({
    name: 'SegmentCondition',
    values: {
        ANY: {},
        ALL: {}
    }
})
