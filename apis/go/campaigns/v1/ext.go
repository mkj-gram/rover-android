package campaignspb

import "fmt"

func CampaignType_Enum_FromString(str string) CampaignType_Enum {
	n, ok := CampaignType_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return CampaignType_Enum(n)
}

func CampaignStatus_Enum_FromString(str string) CampaignStatus_Enum {
	n, ok := CampaignStatus_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return CampaignStatus_Enum(n)
}

func SegmentCondition_Enum_FromString(str string) SegmentCondition_Enum {
	n, ok := SegmentCondition_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return SegmentCondition_Enum(n)
}

func NotificationTapBehaviorType_Enum_FromString(str string) NotificationTapBehaviorType_Enum {
	n, ok := NotificationTapBehaviorType_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return NotificationTapBehaviorType_Enum(n)
}

func NotificationAttachmentType_Enum_FromString(str string) NotificationAttachmentType_Enum {
	n, ok := NotificationAttachmentType_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return NotificationAttachmentType_Enum(n)
}

func NotificationTapPresentationType_Enum_FromString(str string) NotificationTapPresentationType_Enum {
	n, ok := NotificationTapPresentationType_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return NotificationTapPresentationType_Enum(n)
}

func ScheduledType_Enum_FromString(str string) ScheduledType_Enum {
	n, ok := ScheduledType_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return ScheduledType_Enum(n)
}

func ScheduledDeliveryStatus_Enum_FromString(str string) ScheduledDeliveryStatus_Enum {
	n, ok := ScheduledDeliveryStatus_Enum_value[str]
	if !ok {
		panic(fmt.Sprintf("unknown: %q", str))
	}

	return ScheduledDeliveryStatus_Enum(n)
}
