import RoverApis from '@rover/apis'
import grpcEnumMap from '../grpcEnumMap'

export default c => ({
    campaignId: c.getCampaignId(),
    campaignType: 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION',
    name: c.getName(),
    experienceId: c.getExperienceId(),
    campaignStatus: grpcEnumMap(RoverApis.campaigns.v1.Models.CampaignStatus)[
        c.getCampaignStatus()
    ],
    UIState: c.getUiState(),
    notificationBody: c.getNotificationBody(),
    notificationTitle: c.getNotificationTitle(),
    notificationAttachmentType: grpcEnumMap(
        RoverApis.campaigns.v1.Models.NotificationAttachmentType
    )[c.getNotificationAttachmentType()],
    notificationAttachmentUrl: c.getNotificationAttachmentUrl(),
    notificationTapBehaviorType: grpcEnumMap(
        RoverApis.campaigns.v1.Models.NotificationTapBehaviorType
    )[c.getNotificationTapBehaviorType()],
    notificationTapPresentationType: grpcEnumMap(
        RoverApis.campaigns.v1.Models.NotificationTapPresentationType
    )[c.getNotificationTapBehaviorPresentationType()],
    notificationTapBehaviorUrl: c.getNotificationTapBehaviorUrl(),
    notificationIosContentAvailable: c.getNotificationIosContentAvailable(),
    notificationIosMutableContent: c.getNotificationIosMutableContent(),
    notificationIosSound: c.getNotificationIosSound(),
    notificationIosCategoryIdentifier: c.getNotificationIosCategoryIdentifier(),
    notificationIosThreadIdentifier: c.getNotificationIosThreadIdentifier(),
    notificationAndroidChannelId: c.getNotificationAndroidChannelId(),
    notificationAndroidSound: c.getNotificationAndroidSound(),
    notificationAndroidTag: c.getNotificationAndroidTag(),
    notificationExpiration: c.getNotificationExpiration(),
    notificationAttributesMap: () => {
        const attributes = c.getNotificationAttributesMap()
        attributes.keys().arr_.reduce((acc, key) => {
            acc[key] = attributes.get(key)
            return acc
        }, {})
    },
    notificationAlertOptionPushNotification: c.getNotificationAlertOptionPushNotification(),
    notificationAlertOptionNotificationCenter: c.getNotificationAlertOptionNotificationCenter(),
    notificationAlertOptionBadgeNumber: c.getNotificationAlertOptionBadgeNumber(),
    automatedMonday: c.getAutomatedMonday(),
    automatedTuesday: c.getAutomatedTuesday(),
    automatedWednesday: c.getAutomatedWednesday(),
    automatedThursday: c.getAutomatedThursday(),
    automatedFriday: c.getAutomatedFriday(),
    automatedSaturday: c.getAutomatedSaturday(),
    automatedSunday: c.getAutomatedSunday(),
    automatedStartDate: c.getAutomatedStartDate(),
    automatedEndDate: c.getAutomatedEndDate(),
    automatedStartTime: RoverApis.Helpers.timestampFromProto(
        c.getAutomatedStartTime()
    ),
    automatedEndTime: RoverApis.Helpers.timestampFromProto(
        c.getAutomatedEndTime()
    ),
    automatedTimeZone: c.getAutomatedTimeZone(),
    automatedUseLocalDeviceTime: c.getAutomatedUseLocalDeviceTime(),
    automatedEventName: c.getAutomatedEventName(),
    automatedFrequencySingleUse: c.getAutomatedFrequencySingleUse(),
    segmentCondition: grpcEnumMap(
        RoverApis.campaigns.v1.Models.SegmentCondition
    )[c.getSegmentCondition()],
    segmentIds: c.getSegmentIdsList(seg => map(seg.getSegmentId))
})
