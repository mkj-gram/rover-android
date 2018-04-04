package campaigns_grpc

import (
	"encoding/json"
	"fmt"

	"github.com/golang/protobuf/jsonpb"

	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/predicates"
	"github.com/roverplatform/rover/campaigns"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

var pbToJSON = jsonpb.Marshaler{
	EnumsAsInts: false,
}

func fromJSON(data string, v interface{}) error {
	return json.Unmarshal([]byte(data), v)
}

func toJSON(v interface{}) ([]byte, error) {
	return json.Marshal(v)
}

func protoToUpdateAutomatedDeliverySettingsRequest(req *campaignspb.UpdateAutomatedDeliverySettingsRequest, update *campaigns.UpdateAutomatedDeliverySettingsRequest) error {

	update.AccountId = req.AuthContext.AccountId
	update.CampaignId = req.CampaignId

	update.SegmentCondition = req.SegmentCondition.String()
	update.SegmentIds = req.SegmentIds

	update.UiState = req.UiState

	update.AutomatedMonday = req.AutomatedMonday
	update.AutomatedTuesday = req.AutomatedTuesday
	update.AutomatedWednesday = req.AutomatedWednesday
	update.AutomatedThursday = req.AutomatedThursday
	update.AutomatedFriday = req.AutomatedFriday
	update.AutomatedSaturday = req.AutomatedSaturday
	update.AutomatedSunday = req.AutomatedSunday

	update.AutomatedStartDate = req.AutomatedStartDate
	update.AutomatedEndDate = req.AutomatedEndDate

	update.AutomatedStartTime = req.AutomatedStartTime
	update.AutomatedEndTime = req.AutomatedEndTime

	update.AutomatedTimeZone = req.AutomatedTimeZone
	update.AutomatedUseLocalDeviceTime = req.AutomatedUseLocalDeviceTime

	update.AutomatedEventName = req.AutomatedEventName
	if req.AutomatedEventPredicates != nil {
		if data, err := pbToJSON.MarshalToString(req.AutomatedEventPredicates); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			update.AutomatedEventPredicates = data
		}
	}

	update.AutomatedFrequencySingleUse = req.AutomatedFrequencySingleUse
	if req.AutomatedFrequencyLimits != nil {
		if data, err := toJSON(req.AutomatedFrequencyLimits); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			update.AutomatedFrequencyLimits = string(data)
		}
	}

	return nil
}

func protoToUpdateScheduledDeliverySettingsRequest(req *campaignspb.UpdateScheduledDeliverySettingsRequest, update *campaigns.UpdateScheduledDeliverySettingsRequest) error {
	update.AccountId = req.AuthContext.AccountId
	update.CampaignId = req.CampaignId

	update.SegmentCondition = req.SegmentCondition.String()
	update.SegmentIds = req.SegmentIds

	update.UiState = req.UiState

	update.ScheduledType = req.ScheduledType.String()
	if req.ScheduledTimestamp != nil {
		t, _ := timestamp.Time(req.ScheduledTimestamp)
		update.ScheduledTimestamp = &t
	}
	update.ScheduledTimeZone = req.ScheduledTimeZone
	update.ScheduledUseLocalDeviceTime = req.ScheduledUseLocalDeviceTime

	return nil
}

func protoToUpdateNotificationSettingsRequest(req *campaignspb.UpdateNotificationSettingsRequest, update *campaigns.UpdateNotificationSettingsRequest) error {
	update.AccountId = req.AuthContext.AccountId
	update.CampaignId = req.CampaignId
	update.ExperienceId = req.ExperienceId

	update.UiState = req.UiState

	update.NotificationAndroidChannelId = req.NotificationAndroidChannelId
	update.NotificationBody = req.NotificationBody
	update.NotificationTitle = req.NotificationTitle
	update.NotificationAttachmentUrl = req.NotificationAttachmentUrl
	update.NotificationAttachmentType = req.NotificationAttachmentType.String()
	update.NotificationTapBehaviorType = req.NotificationTapBehaviorType.String()
	update.NotificationTapBehaviorPresentationType = req.NotificationTapBehaviorPresentationType.String()
	update.NotificationTapBehaviorUrl = req.NotificationTapBehaviorUrl
	update.NotificationIosContentAvailable = req.NotificationIosContentAvailable
	update.NotificationIosMutableContent = req.NotificationIosMutableContent
	update.NotificationIosSound = req.NotificationIosSound
	update.NotificationIosCategoryIdentifier = req.NotificationIosCategoryIdentifier
	update.NotificationIosThreadIdentifier = req.NotificationIosThreadIdentifier
	update.NotificationAndroidChannelId = req.NotificationAndroidChannelId
	update.NotificationAndroidSound = req.NotificationAndroidSound
	update.NotificationAndroidTag = req.NotificationAndroidTag
	update.NotificationExpiration = req.NotificationExpiration

	if req.NotificationAttributes != nil {
		if data, err := toJSON(req.NotificationAttributes); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			update.NotificationAttributes = string(data)
		}
	}

	update.NotificationAlertOptionPushNotification = req.NotificationAlertOptionPushNotification
	update.NotificationAlertOptionNotificationCenter = req.NotificationAlertOptionNotificationCenter
	update.NotificationAlertOptionBadgeNumber = req.NotificationAlertOptionBadgeNumber

	return nil
}

func CampaignToProto(c *campaigns.Campaign, proto *campaignspb.Campaign) error {
	switch campaignspb.CampaignType_Enum_FromString(c.CampaignType) {
	case campaignspb.CampaignType_SCHEDULED_NOTIFICATION:
		var cc = &campaignspb.ScheduledNotificationCampaign{}
		proto.Campaign = &campaignspb.Campaign_ScheduledNotificationCampaign{cc}
		return wrapError(campaignToProtoScheduledNotification(c, cc), "toProtoScheduledNotification")
	case campaignspb.CampaignType_AUTOMATED_NOTIFICATION:
		var cc = &campaignspb.AutomatedNotificationCampaign{}
		proto.Campaign = &campaignspb.Campaign_AutomatedNotificationCampaign{cc}
		return wrapError(campaignToProtoAutomatedNotification(c, cc), "toProtoAutomatedNotification")
	default:
		panic(fmt.Sprintf("campaignToProto: type unknown: campaign_type=%v", c.CampaignType))
	}

	return nil
}

func campaignToProtoAutomatedNotification(c *campaigns.Campaign, proto *campaignspb.AutomatedNotificationCampaign) error {
	proto.CampaignId = c.CampaignId

	proto.Name = c.Name

	proto.ExperienceId = c.ExperienceId

	// TODO: handle error
	proto.CreatedAt, _ = timestamp.TimestampProto(c.CreatedAt)
	proto.UpdatedAt, _ = timestamp.TimestampProto(c.UpdatedAt)

	proto.CampaignStatus = campaignspb.CampaignStatus_Enum_FromString(c.CampaignStatus)
	// proto.CampaignType = campaignspb.CampaignType_CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION
	proto.SegmentIds = c.SegmentIds
	proto.SegmentCondition = campaignspb.SegmentCondition_Enum_FromString(c.SegmentCondition)

	proto.UiState = c.UiState

	proto.NotificationBody = c.NotificationBody
	proto.NotificationTitle = c.NotificationTitle
	proto.NotificationAttachmentUrl = c.NotificationAttachmentUrl

	proto.NotificationAttachmentType = campaignspb.NotificationAttachmentType_Enum_FromString(c.NotificationAttachmentType)
	proto.NotificationTapBehaviorType = campaignspb.NotificationTapBehaviorType_Enum_FromString(c.NotificationTapBehaviorType)
	proto.NotificationTapBehaviorPresentationType = campaignspb.NotificationTapPresentationType_Enum_FromString(c.NotificationTapBehaviorPresentationType)

	proto.NotificationTapBehaviorUrl = c.NotificationTapBehaviorUrl
	proto.NotificationIosContentAvailable = c.NotificationIosContentAvailable
	proto.NotificationIosMutableContent = c.NotificationIosMutableContent
	proto.NotificationIosSound = c.NotificationIosSound
	proto.NotificationIosCategoryIdentifier = c.NotificationIosCategoryIdentifier
	proto.NotificationIosThreadIdentifier = c.NotificationIosThreadIdentifier
	proto.NotificationAndroidChannelId = c.NotificationAndroidChannelId
	proto.NotificationAndroidSound = c.NotificationAndroidSound
	proto.NotificationAndroidTag = c.NotificationAndroidTag
	proto.NotificationExpiration = c.NotificationExpiration

	if c.NotificationAttributes != "" {
		var m map[string]string
		if err := fromJSON(c.NotificationAttributes, &m); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			proto.NotificationAttributes = m
		}
	}

	proto.NotificationAlertOptionPushNotification = c.NotificationAlertOptionPushNotification
	proto.NotificationAlertOptionNotificationCenter = c.NotificationAlertOptionNotificationCenter
	proto.NotificationAlertOptionBadgeNumber = c.NotificationAlertOptionBadgeNumber

	proto.AutomatedMonday = c.AutomatedMonday
	proto.AutomatedTuesday = c.AutomatedTuesday
	proto.AutomatedWednesday = c.AutomatedWednesday
	proto.AutomatedThursday = c.AutomatedThursday
	proto.AutomatedFriday = c.AutomatedFriday
	proto.AutomatedSaturday = c.AutomatedSaturday
	proto.AutomatedSunday = c.AutomatedSunday

	proto.AutomatedStartDate = c.AutomatedStartDate
	proto.AutomatedEndDate = c.AutomatedEndDate

	proto.AutomatedStartTime = c.AutomatedStartTime
	proto.AutomatedEndTime = c.AutomatedEndTime

	proto.AutomatedTimeZone = c.AutomatedTimeZone

	proto.AutomatedUseLocalDeviceTime = c.AutomatedUseLocalDeviceTime
	proto.AutomatedEventName = c.AutomatedEventName
	if c.AutomatedEventPredicates != "" {
		var pa predicates.PredicateAggregate
		if err := jsonpb.UnmarshalString(c.AutomatedEventPredicates, &pa); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			proto.AutomatedEventPredicates = &pa
		}
	}

	proto.AutomatedFrequencySingleUse = c.AutomatedFrequencySingleUse

	if c.AutomatedFrequencyLimits != "" {
		var lx []*campaignspb.RateLimit
		if err := fromJSON(c.AutomatedFrequencyLimits, &lx); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			proto.AutomatedFrequencyLimits = lx
		}
	}

	return nil
}

func campaignToProtoScheduledNotification(c *campaigns.Campaign, proto *campaignspb.ScheduledNotificationCampaign) error {
	proto.CampaignId = c.CampaignId
	proto.Name = c.Name
	proto.ExperienceId = c.ExperienceId

	proto.CreatedAt, _ = timestamp.TimestampProto(c.CreatedAt)
	proto.UpdatedAt, _ = timestamp.TimestampProto(c.UpdatedAt)

	proto.CampaignStatus = campaignspb.CampaignStatus_Enum_FromString(c.CampaignStatus)
	// proto.CampaignType = campaignspb.CampaignType_CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION

	proto.SegmentIds = c.SegmentIds
	proto.SegmentCondition = campaignspb.SegmentCondition_Enum_FromString(c.SegmentCondition)

	proto.UiState = c.UiState

	proto.NotificationBody = c.NotificationBody
	proto.NotificationTitle = c.NotificationTitle
	proto.NotificationAttachmentUrl = c.NotificationAttachmentUrl

	proto.NotificationAttachmentType = campaignspb.NotificationAttachmentType_Enum_FromString(c.NotificationAttachmentType)
	proto.NotificationTapBehaviorType = campaignspb.NotificationTapBehaviorType_Enum_FromString(c.NotificationTapBehaviorType)

	proto.NotificationTapBehaviorPresentationType = campaignspb.NotificationTapPresentationType_Enum_FromString(c.NotificationTapBehaviorPresentationType)

	proto.NotificationTapBehaviorUrl = c.NotificationTapBehaviorUrl
	proto.NotificationIosContentAvailable = c.NotificationIosContentAvailable
	proto.NotificationIosMutableContent = c.NotificationIosMutableContent
	proto.NotificationIosSound = c.NotificationIosSound
	proto.NotificationIosCategoryIdentifier = c.NotificationIosCategoryIdentifier
	proto.NotificationIosThreadIdentifier = c.NotificationIosThreadIdentifier
	proto.NotificationAndroidChannelId = c.NotificationAndroidChannelId
	proto.NotificationAndroidSound = c.NotificationAndroidSound
	proto.NotificationAndroidTag = c.NotificationAndroidTag
	proto.NotificationExpiration = c.NotificationExpiration

	if c.NotificationAttributes != "" {
		var m map[string]string
		if err := fromJSON(c.NotificationAttributes, &m); err != nil {
			// TODO: handle error
			panic(err)
		} else {
			proto.NotificationAttributes = m
		}
	}

	proto.NotificationAlertOptionPushNotification = c.NotificationAlertOptionPushNotification
	proto.NotificationAlertOptionNotificationCenter = c.NotificationAlertOptionNotificationCenter
	proto.NotificationAlertOptionBadgeNumber = c.NotificationAlertOptionBadgeNumber

	proto.ScheduledType = campaignspb.ScheduledType_Enum_FromString(c.ScheduledType)
	if c.ScheduledTimestamp != nil {
		// TODO: handle error
		proto.ScheduledTimestamp, _ = timestamp.TimestampProto(*c.ScheduledTimestamp)
	}
	proto.ScheduledTimeZone = c.ScheduledTimeZone
	proto.ScheduledUseLocalDeviceTime = c.ScheduledUseLocalDeviceTime
	proto.ScheduledDeliveryStatus = campaignspb.ScheduledDeliveryStatus_Enum_FromString(c.ScheduledDeliveryStatus)

	return nil
}
