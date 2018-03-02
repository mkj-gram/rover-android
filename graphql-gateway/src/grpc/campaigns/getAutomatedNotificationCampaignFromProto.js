import RoverApis from '@rover/apis'
import grpcEnumMap from '../grpcEnumMap'

export default c => ({
    campaignId: c.getCampaignId(),
    campaignType: 'AUTOMATED_NOTIFICATION',
    name: c.getName(),
    experienceId: c.getExperienceId(),
    campaignStatus: grpcEnumMap(
        RoverApis.campaigns.v1.Models.CampaignStatus.Enum
    )[c.getCampaignStatus()],
    UIState: c.getUiState(),
    notificationBody: c.getNotificationBody(),
    notificationTitle: c.getNotificationTitle(),
    notificationAttachment: () => {
        let attachment = {}
        switch (c.getNotificationAttachmentType()) {
            case 0:
                return null
            case 1:
                attachment.type = 'image'
                break
            case 2:
                attachment.type = 'audio'
                break
            case 3:
                attachment.type = 'video'
                break
        }

        attachment.url = c.getNotificationAttachmentUrl()
        return attachment
    },
    notificationTapBehaviorType: grpcEnumMap(
        RoverApis.campaigns.v1.Models.NotificationTapBehaviorType.Enum
    )[c.getNotificationTapBehaviorType()],
    notificationTapPresentationType: grpcEnumMap(
        RoverApis.campaigns.v1.Models.NotificationTapPresentationType.Enum
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
        RoverApis.campaigns.v1.Models.SegmentCondition.Enum
    )[c.getSegmentCondition()],
    segmentIds: c.getSegmentIdsList(seg => map(seg.getSegmentId))
})
