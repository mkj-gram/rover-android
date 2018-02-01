type CampaignStatus =
    | 'CAMPAIGN_STATUS_DRAFT'
    | 'CAMPAIGN_STATUS_PUBLISHED'
    | 'CAMPAIGN_STATUS_ARCHIVED'

type CampaignType =
    | 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION'
    | 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION'

declare enum NotificationAttachmentType {
    image = 'NOTIFICATION_ATTACHMENT_TYPE_IMAGE',
    audio = 'NOTIFICATION_ATTACHMENT_TYPE_AUDIO',
    video = 'NOTIFICATION_ATTACHMENT_TYPE_VIDEO',
    unknown = 'NOTIFICATION_ATTACHMENT_TYPE_UNKNOWN'
}

declare enum NotificationTapBehaviorType {
    unknown = 'NOTIFICATION_TAP_BEHAVIOR_TYPE_UNKNOWN',
    app = 'NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_APP',
    experience = 'NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_EXPERIENCE',
    deeplink = 'NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_DEEP_LINK'
}

declare enum NotificationTapPresentationType {
    unknown = 'NOTIFICATION_TAP_PRESENTATION_TYPE_UNKNOWN',
    app = 'NOTIFICATION_TAP_PRESENTATION_TYPE_IN_APP',
    browser = 'NOTIFICATION_TAP_PRESENTATION_TYPE_IN_BROWSER'
}

declare enum ScheduledDeliveryStatus {
    unknown = 'DELIVERY_STATUS_UNKNOWN',
    scheduled = 'DELIVERY_STATUS_SCHEDULED',
    inprogress = 'DELIVERY_STATUS_INPROGRESS',
    finished = 'DELIVERY_STATUS_FINISHED'
}

declare enum ScheduledType {
    unknown = 'SCHEDULED_TYPE_UNKNOWN',
    now = 'SCHEDULED_TYPE_NOW',
    scheduled = 'SCHEDULED_TYPE_SCHEDULED'
}

declare enum SegmentCondition {
    any = 'ANY',
    all = 'ALL'
}

interface StringMap<T> {
    [x: string]: T
}

declare abstract class Campaign {
    name: string
    campaignId: string
    campaignType: CampaignType
    campaignStatus: CampaignStatus
}

declare class ScheduledCampaign extends Campaign {
    notificationBody: string
    notificationTitle: string
    notificationAttachmentUrl: string
    notificationAttachmentType: NotificationAttachmentType
    notificationTapBehaviorType: NotificationTapBehaviorType
    notificationTapBehaviorExperienceId: string
    notificationTapBehaviorUrl: string
    notificationTapPresentationType: NotificationTapPresentationType
    notificationIOSContentAvailable: boolean
    notificationIOSMutableContent: boolean
    notificationIOSSound: string
    notificationIOSCategoryIdentifier: string
    notificationIOSThreadIdentifier: string
    notificationAndroidChannelId: string
    notificationAndroidSound: string
    notificationAndroidTag: string
    notificationExpiration: string
    notificationAttributes: StringMap<string>
    notificationAlertOptionPushNotification: boolean
    notificationAlertOptionNotificationCenter: boolean
    notificationAlertOptionBadgeNumber: boolean
    scheduledType: ScheduledType
    scheduledTimestamp: string
    scheduledTimeZone: string
    scheduledUseLocalDeviceTime: boolean
    segmentIds: Array<string>
    segmentCondition: SegmentCondition
    scheduledDeliveryStatus: ScheduledDeliveryStatus
}

declare class AutomatedNotificationCampaign extends Campaign {
    notificationBody: string
    notificationTitle: string
    notificationAttachmentUrl: string
    notificationAttachmentType: NotificationAttachmentType
    notificationTapBehaviorType: NotificationTapBehaviorType
    notificationTapBehaviorExperienceId: string
    notificationTapBehaviorUrl: string
    notificationTapPresentationType: NotificationTapPresentationType
    notificationIOSContentAvailable: boolean
    notificationIOSMutableContent: boolean
    notificationIOSSound: string
    notificationIOSCategoryIdentifier: string
    notificationIOSThreadIdentifier: string
    notificationAndroidChannelId: string
    notificationAndroidSound: string
    notificationAndroidTag: string
    notificationExpiration: string
    notificationAttributes: StringMap<string>
    notificationAlertOptionPushNotification: boolean
    notificationAlertOptionNotificationCenter: boolean
    notificationAlertOptionBadgeNumber: boolean
    automatedMonday: boolean
    automatedTuesday: boolean
    automatedWednesday: boolean
    automatedThursday: boolean
    automatedFriday: boolean
    automatedSaturday: boolean
    automatedSunday: boolean
    automatedStartDate: string
    automatedEndDate: string
    auotmatedStartTime: number
    automatedEndTime: number
    automatedTimeZone: string
    automatedUseLocalDeviceTime: boolean
    automatedEventName: string
    // automatedEventPredicates: predicates
    segmentIds: Array<string>
    segmentCondition: SegmentCondition
}

type State = {
    readonly campaigns: StringMap<Campaign>
}

type Media = 'Mobile' | 'Tablet' | 'Desktop'
