type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNKNOWN'

type CampaignType =
    | 'SCHEDULED_NOTIFICATION'
    | 'AUTOMATED_NOTIFICATION'
    | 'INTERSTITIAL'
    | 'WEB'
    | 'UNKNOWN'

type NotificationAttachment = {
    type: 'IMAGE' | 'AUDIO' | 'VIDEO'
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
}

type UIStateType =
    | 'notification'
    | 'experience'
    | 'scheduleddelivery'
    | 'automateddelivery'

type UIStateField = {
    seen: boolean
    type: UIStateType
}

type editableUIState = {
    // Notification Settings
    messageAndMedia: UIStateField
    alertOptions: UIStateField
    tapBehavior: UIStateField
    advancedSettings: UIStateField

    // Scheduled Delivery Settings
    dateAndTime: UIStateField
}

interface Campaign {
    name: string
    campaignId: string
    campaignType: CampaignType
    campaignStatus: CampaignStatus
    UIState: UIStateInterface | string
}

interface ScheduledCampaign extends Campaign {
    notificationBody: string
    notificationTitle: string
    notificationAttachment: NotificationAttachment
    notificationTapBehaviorType: NotificationTapBehaviorType
    notificationTapBehaviorExperienceId: string
    notificationTapBehaviorUrl: string
    notificationTapPresentationType: NotificationTapPresentationType
    notificationIosContentAvailable: boolean
    notificationIosMutableContent: boolean
    notificationIosSound: string
    notificationIosCategoryIdentifier: string
    notificationIosThreadIdentifier: string
    notificationAndroidChannelId: string
    notificationAndroidSound: string
    notificationAndroidTag: string
    notificationExpiration: string
    notificationAttributes: StringMap<string>
    notificationAlertOptionPushNotification: boolean
    notificationAlertOptionNotificationCenter: boolean
    notificationAlertOptionBadgeNumber: boolean
    scheduledType: ScheduledType
    scheduledDate: string
    scheduledTime: number
    scheduledTimeZone: string
    scheduledUseLocalDeviceTime: boolean
    segmentIds: Array<string>
    segmentCondition: SegmentCondition
    scheduledDeliveryStatus: ScheduledDeliveryStatus
}

interface AutomatedNotificationCampaign extends Campaign {
    notificationBody: string
    notificationTitle: string
    notificationAttachment: NotificationAttachment
    notificationTapBehaviorType: NotificationTapBehaviorType
    notificationTapBehaviorExperienceId: string
    notificationTapBehaviorUrl: string
    notificationTapPresentationType: NotificationTapPresentationType
    notificationIosContentAvailable: boolean
    notificationIosMutableContent: boolean
    notificationIosSound: string
    notificationIosCategoryIdentifier: string
    notificationIosThreadIdentifier: string
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
    readonly app: AppState
    readonly campaigns: StringMap<Campaign>
    readonly testDevices: TestDeviceState
    readonly modal: StringMap<string | boolean>
    readonly editableCampaign: AutomatedNotificationCampaign | ScheduledCampaign
    readonly editableUIState: editableUIState
}

type TestDeviceState = {
    readonly selectedTestDevices: string[]
    readonly testDevices: StringMap<string>
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
    activePopover: PopoverState
    form: FormState
    wizardModal: WizardModal
}

type PopoverState = {
    readonly activePopover: string
    readonly isPopoverModalFormOpen: string
}

type ErrorState = StringMap<string | boolean>

type formPage =
    | ''
    | 'messageAndMedia'
    | 'alertOptions'
    | 'tapBehavior'
    | 'advancedSettings'
    | 'dateAndTime'

type FormState = {
    readonly currentPage: formPage
}

type OverviewModalState = {
    readonly isOverviewModalOpen: string
    readonly isSendTestModalOpen: string
    readonly triggeredAnimation: string
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

type WizardModal = {
    readonly currentWizard: UIStateType
    readonly isWizardModalOpen: boolean
    readonly isWizardModalClosing: boolean
}

interface InjectedProps {
    device?: Media
}

type alertType =
    | 'notificationAlertOptionBadgeNumber'
    | 'notificationAlertOptionPushNotification'
    | 'notificationAlertOptionNotificationCenter'
