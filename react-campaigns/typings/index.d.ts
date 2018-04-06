type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNKNOWN'

type CampaignType =
    | 'SCHEDULED_NOTIFICATION'
    | 'AUTOMATED_NOTIFICATION'
    | 'INTERSTITIAL'
    | 'WEB'
    | 'UNKNOWN'

type NotificationAttachment = {
    type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'UNKNOWN'
    url: string
}

type NotificationTapBehaviorType =
    | 'UNKNOWN'
    | 'OPEN_APP'
    | 'OPEN_EXPERIENCE'
    | 'OPEN_DEEP_LINK'
    | 'OPEN_WEBSITE'

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

interface UIStateInterface {
    notification: StringMap<StringMap<boolean>>
    showExperience: boolean // Deprecate when updating overview page
}

type UIStateType = 'notification'

declare abstract class Campaign {
    name: string
    campaignId: string
    campaignType: CampaignType
    campaignStatus: CampaignStatus
    UIState: UIStateInterface | string
}

declare class ScheduledCampaign extends Campaign {
    notificationBody: string
    notificationTitle: string
    notificationAttachment: NotificationAttachment
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
    notificationAttachment: NotificationAttachment
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
    readonly editableCampaign: AutomatedNotificationCampaign | ScheduledCampaign
    readonly app: AppState
}

type HomeState = {
    readonly isCreatingCampaign: boolean
    readonly isFetching: boolean
    readonly isNewCampaignPopoverOpen: boolean
    readonly isNewCampaignPopoverClosing: boolean
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

type AppState = {
    home: HomeState
    notificationDelivery: NotificationDeliveryState
    notification: NotificationState
    overview: OverviewModalState
    error: ErrorState
}

type ErrorState = StringMap<string | boolean>

type OverviewModalState = {
    readonly isOverviewModalOpen: string
    readonly isSendTestModalOpen: string
}

type NotificationDeliveryState = {
    readonly isNotificationDeliveryModalOpen: string
    readonly lastViewPage: string
}

type NotificationState = {
    readonly isTapBehaviorSelectorOpen: string
    readonly isTapBehaviorWebsitePresentationOpen: string
    readonly alertOptionsHoverValue: string
    readonly isAlertOptionsOpen: string
}

interface InjectedProps {
    device?: string
}
