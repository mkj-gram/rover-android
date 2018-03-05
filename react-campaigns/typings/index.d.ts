type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNKNOWN'

type CampaignType =
    | 'SCHEDULED_NOTIFICATION'
    | 'AUTOMATED_NOTIFICATION'
    | 'INTERSTITIAL'
    | 'WEB'
    | 'UNKNOWN'

type NotificationAttachmentType = 'IMAGE' | 'AUDIO' | 'VIDEO' | 'UNKNOWN'

type NotificationTapBehaviorType =
    | 'UNKNOWN'
    | 'OPEN_APP'
    | 'OPEN_EXPERIENCE'
    | 'OPEN_DEEP_LINK'

type NotificationTapPresentationType = 'UNKNOWN' | 'IN_APP' | 'IN_BROWSER'

type ScheduledDeliveryStatus =
    | 'UNKNOWN'
    | 'SCHEDULED'
    | 'INPROGRESS'
    | 'FINISHED'

type ScheduledType = 'NOW' | 'SCHEDULED'

type AutomatedActiveStatus = 'UNKNOWN' | 'ACTIVE' | 'UPCOMING' | 'EXPIRED'

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
