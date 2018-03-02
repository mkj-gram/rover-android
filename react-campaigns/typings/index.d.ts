type CampaignStatus =
    | 'CAMPAIGN_STATUS_DRAFT'
    | 'CAMPAIGN_STATUS_PUBLISHED'
    | 'CAMPAIGN_STATUS_ARCHIVED'
    | 'CAMPAIGN_STATUS_UNDEFINED'

type CampaignType =
    | 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION'
    | 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION'
    | 'CAMPAIGN_TYPE_INTERSTITIAL'
    | 'CAMPAIGN_TYPE_WEB'
    | 'CAMPAIGN_TYPE_UNDEFINED'

type NotificationAttachmentType =
    | 'NOTIFICATION_ATTACHMENT_TYPE_IMAGE'
    | 'NOTIICATION_ATTACHMENT_TYPE_AUDIO'
    | 'NOTIFICATION_ATTACHMENT_TYPE_VIDEO'
    | 'NOTIFICATION_ATTACHMENT_TYPE_UNKNOWN'

type NotificationTapBehaviorType =
    | 'NOTIFICATION_TAP_BEHAVIOR_TYPE_UNKNOWN'
    | 'NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_APP'
    | 'NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_EXPERIENCE'
    | 'NOTIFICATION_TAP_BEHAVIOR_TYPE_OPEN_DEEP_LINK'

type NotificationTapPresentationType =
    | 'NOTIFICATION_TAP_PRESENTATION_TYPE_UNKNOWN'
    | 'NOTIFICATION_TAP_PRESENTATION_TYPE_IN_APP'
    | 'NOTIFICATION_TAP_PRESENTATION_TYPE_IN_BROWSER'

type ScheduledDeliveryStatus =
    | 'SCHEDULED_DELIVERY_STATUS_UNKNOWN'
    | 'SCHEDULED_DELIVERY_STATUS_SCHEDULED'
    | 'SCHEDULED_DELIVERY_STATUS_INPROGRESS'
    | 'SCHEDULED_DELIVERY_STATUS_FINISHED'

type ScheduledType =
    | 'SCHEDULED_TYPE_UNKNOWN'
    | 'SCHEDULED_TYPE_NOW'
    | 'SCHEDULED_TYPE_SCHEDULED'

type AutomatedActiveStatus =
    | 'AUTOMATED_ACTIVE_STATUS_UNKNOWN'
    | 'AUTOMATED_ACTIVE_STATUS_ACTIVE'
    | 'AUTOMATED_ACTIVE_STATUS_UPCOMING'
    | 'AUTOMATED_ACTIVE_STATUS_EXPIRED'

type SegmentCondition = 'ANY' | 'ALL'

interface StringMap<T> {
    [x: string]: T
}

declare abstract class Campaign {
    name: string
    campaignId: string
    campaignType: CampaignType
    campaignStatus: CampaignStatus
    UIState: string
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
    readonly testDevices: StringMap<string>
    readonly modal: StringMap<string | boolean>
    readonly app: AppState
}

type AppState = {
    home: HomeState
}

type HomeState = {
    readonly isCreatingCampaign: boolean
    readonly isFetching: boolean
    readonly isNewCampaignPopoverOpen: boolean
    readonly isCampaignTypeSelectorOpen: boolean
    readonly isCampaignTypeSelectorClosing: boolean
}

type Media = 'Mobile' | 'Tablet' | 'Desktop'

declare module 'react-media' {
    var a: any
    export default a
}

interface OverviewModalRowContainerProps {
    name: string
    text: string
    val: number | boolean
}

// type RoverSVGProps = {
//     fill?: string
//     style?: StringMap<string | number>
// }

interface ResponsiveContainerProps {
    device?: Media
}

type QueryParams = {
    campaignId: string
    campaignStatus: 'all' | 'drafts' | 'published' | 'archived'
    campaignType: 'all' | 'scheduled' | 'automated' | 'web' | 'interstitial'
    pageNumber: string
    keyword: string
}
