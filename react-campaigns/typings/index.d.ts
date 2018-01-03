    enum CampaignStatus {
        Draft = 'DRAFT',
        Published = 'PUBLISHED',
        Archived = 'ARCHIVED'
    }

    enum CampaignType {
        ScheduledNotification = 'SCHEDULED_NOTIFICATION',
        AutomaticNotification = 'AUTOMATIC_NOTIFICATION',
        Manual = 'MANUAL'
    }

    enum NotificationAttachmentType {
        image = 'IMAGE',
        audio = 'AUDIO',
        video = 'VIDEO',
        unknown = 'UNKNOWN'
    }

    enum NotificationTapBehaviourPresentationType {
        app = 'APP',
        browser = 'BROWSER'
    }

    enum NotificationTapBehaviourType {
        app = 'APP',
        experience = 'EXPERIENCE',
        deeplink = 'DEEP_LINK'
    }

    enum ScheduledDeliveryStatus {
        scheduled = 'SCHEDULED',
        inprogress = 'IN_PROGRESS',
        finished = 'FINISHED'
    }

    enum ScheduledType {
        now = 'NOW',
        scheduled = 'SCHEDULED'
    }

    enum SegmentCondition {
        any = 'ANY',
        all = 'ALL'
    }

    interface StringMap<T> {
    [x: string]: T
    }

    abstract class Campaign {
        name: string
        campaignId: string
        campaignType: CampaignType
        campaignStatus: CampaignStatus
    }

    class ScheduledCampaign extends Campaign {
        notificationBody: string
        notificationTitle: string
        notificationAttachmentUrl: string
        notificationAttachmentType: NotificationAttachmentType
        notificationTapBehaviourType: NotificationTapBehaviourType
        notificationTapBehaviourExperienceId: string
        notificationTapBehaviourUrl: string
        notificationTapBehaviourPresentationType: NotificationTapBehaviourPresentationType
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

    class AutomatedNotifcationCampaign extends Campaign {
        notificationBody: string
        notificationTitle: string
        notificationAttachmentUrl: string
        notificationAttachmentType: NotificationAttachmentType
        notificationTapBehaviourType: NotificationTapBehaviourType
        notificationTapBehaviourExperienceId: string
        notificationTapBehaviourUrl: string
        notificationTapBehaviourPresentationType: NotificationTapBehaviourPresentationType
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

    class ManualCampaign extends Campaign {
        url: string
    }

    type State = {
        readonly Campaigns: StringMap<Campaign>
    }