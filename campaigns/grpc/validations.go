package campaigns_grpc

import (
	"github.com/pkg/errors"
	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	va "github.com/roverplatform/rover/campaigns/validations"
	"strings"
)

var (
	ErrInvalid = errors.New("invalid")
)

func validateCampaign(c *campaignspb.Campaign) error {
	if c == nil {
		return errors.Wrap(va.ErrRequired, "campaign")
	}

	switch c := c.Campaign.(type) {
	case *campaignspb.Campaign_AutomatedNotificationCampaign:
		// TODO:
	case *campaignspb.Campaign_ScheduledNotificationCampaign:
		return validateScheduledNotificationCampaign(c.ScheduledNotificationCampaign)
	default:
		return errors.Errorf("campaign: type: unknown")
	}

	return nil
}

func validateScheduledNotificationCampaign(c *campaignspb.ScheduledNotificationCampaign) error {

	var (
		validateNotificationAttachmentType = func(_ interface{}) error {
			var (
				isBlankUrl    = strings.TrimSpace(c.NotificationAttachmentUrl) == ""
				isUnknownType = c.NotificationAttachmentType == campaignspb.NotificationAttachmentType_UNKNOWN
			)
			if !isBlankUrl && isUnknownType {
				return va.ErrRequired
			}
			return nil
		}

		validateNotificationAttachmentURL = func(_ interface{}) error {
			var (
				isBlankUrl    = strings.TrimSpace(c.NotificationAttachmentUrl) == ""
				isUnknownType = c.NotificationAttachmentType == campaignspb.NotificationAttachmentType_UNKNOWN
			)
			if !isUnknownType && isBlankUrl {
				return va.ErrRequired
			}
			return nil
		}

		validateNotificationTapBehaviourUrl = func(_ interface{}) error {
			var (
				isBlankUrl     = strings.TrimSpace(c.NotificationTapBehaviorUrl) == ""
				isOpenWebsite  = c.NotificationTapBehaviorType == campaignspb.NotificationTapBehaviorType_OPEN_WEBSITE
				isOpenDeepLink = c.NotificationTapBehaviorType == campaignspb.NotificationTapBehaviorType_OPEN_DEEP_LINK
			)
			if (isOpenDeepLink || isOpenWebsite) && isBlankUrl {
				return va.ErrRequired
			}
			return nil
		}

		validateNotificationTapBehaviourPresentationType = func(_ interface{}) error {
			var (
				isOpenWebsite = c.NotificationTapBehaviorType == campaignspb.NotificationTapBehaviorType_OPEN_WEBSITE
				// TODO: UNKNOWN is not required
				// presentation_type could default to in_app but only be required
				// if tap_behavior is set to open_website
				isUnknownPresentation = c.NotificationTapBehaviorPresentationType == campaignspb.NotificationTapPresentationType_UNKNOWN
			)
			if isOpenWebsite && isUnknownPresentation {
				return va.ErrRequired
			}
			return nil
		}

		validateAlertOptionNotification = func(_ interface{}) error {
			if !(c.NotificationAlertOptionPushNotification || c.NotificationAlertOptionNotificationCenter) {
				return errors.New("push notification or notification centre must be enabled")
			}
			return nil
		}

		validateAlertOptionPushNotification   = validateAlertOptionNotification
		validateAlertOptionNotificationCentre = validateAlertOptionNotification

		validateAlertOptionBadgeNumber = func(_ interface{}) error {
			if !c.NotificationAlertOptionNotificationCenter && c.NotificationAlertOptionBadgeNumber {
				return errors.New("badging only available with notification centre option enabled")
			}
			return nil
		}

		validateScheduledDate = func(_ interface{}) error {
			switch c.ScheduledType {
			case campaignspb.ScheduledType_NOW:
				return nil
			case campaignspb.ScheduledType_SCHEDULED:
				if c.ScheduledDate == nil {
					return va.ErrRequired
				}
			default:
			}
			return nil
		}

		validateScheduledTime = func(_ interface{}) error {
			switch c.ScheduledType {
			case campaignspb.ScheduledType_NOW:
				return nil
			case campaignspb.ScheduledType_SCHEDULED:
				if c.ScheduledTime == nil {
					return va.ErrRequired
				}
			}
			return nil
		}

		validateScheduledTimeZone = func(_ interface{}) error {
			switch c.ScheduledType {
			case campaignspb.ScheduledType_NOW:
				return nil
			case campaignspb.ScheduledType_SCHEDULED:
				var (
					isBlankTimeZone  = strings.TrimSpace(c.ScheduledTimeZone) == ""
					useLocalTimeZone = c.ScheduledUseLocalDeviceTime
				)
				if !useLocalTimeZone && isBlankTimeZone {
					return va.ErrRequired
				}
			}

			return nil
		}

		validateExperienceId = func(_ interface{}) error {
			var (
				isOpenExperience = c.NotificationTapBehaviorType == campaignspb.NotificationTapBehaviorType_OPEN_EXPERIENCE
			)

			if c.ExperienceId == "" && isOpenExperience {
				return va.ErrRequired
			}

			return nil
		}
	)

	var validators = []*va.ValueValidator{
		va.Value("notification_body", strings.TrimSpace(c.NotificationBody), va.Require),

		va.Value("attachment_type", nil, validateNotificationAttachmentType),
		va.Value("attachment_url", nil, validateNotificationAttachmentURL),

		//
		// Tap Behavior
		//
		va.Value("notification_tap_behavior_url", nil, validateNotificationTapBehaviourUrl),

		// Tap Website Presentation
		va.Value("notification_tap_behavior_presentation_type", nil, validateNotificationTapBehaviourPresentationType),

		//
		// Notification
		//
		va.Value("notification_alert_option_push_notification", nil, validateAlertOptionPushNotification),
		va.Value("notification_alert_option_notification_centre", nil, validateAlertOptionNotificationCentre),
		va.Value("notification_alert_option_badge_number", nil, validateAlertOptionBadgeNumber),

		//
		// Schedule
		//
		va.Value("scheduled_date", nil, validateScheduledDate),
		va.Value("scheduled_time", nil, validateScheduledTime),
		va.Value("scheduled_time_zone", nil, validateScheduledTimeZone),

		//
		// Experience
		//
		va.Value("experience_id", nil, validateExperienceId),
	}

	return va.All(validators...)
}
