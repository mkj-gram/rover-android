package push

import (
	"encoding/json"
	"time"

	"github.com/roverplatform/rover/notification/scylla"
)

type Attachment struct {
	Type string `json:"type"`
	Url  string `json:"url"`
}

type actionInfo struct {
	tapBehaviorType             string
	campaignId                  int
	tapBehaviorPresentationType string
	tapBehaviorUrl              string

	settings *scylla.NotificationSettings
}

// see rover/protos/campaigns/v1/campaigns.proto:58
// and graphql-gateway/src/grpc/notification/getNotificationFromProto.js
// for mappings
func (action *actionInfo) MarshalJSON() ([]byte, error) {
	type M = map[string]interface{}
	var payload M

	switch action.tapBehaviorType {
	// 0
	case string(scylla.TapBehaviorType_OPEN_EXPERIENCE):
		payload = M{
			"__typename": "PresentExperienceAction",
			"campaignID": action.campaignId,
		}
		// 1
	case string(scylla.TapBehaviorType_OPEN_APP):
		payload = nil
		// 2
	case string(scylla.TapBehaviorType_OPEN_DEEP_LINK):
		payload = M{
			"__typename": "OpenURLAction",
			"url":        action.tapBehaviorUrl,
		}
		// 3
	case string(scylla.TapBehaviorType_OPEN_WEBSITE):
		switch action.tapBehaviorPresentationType {
		case string(scylla.TapBehaviorPresentationType_IN_BROWSER):
			payload = M{
				"__typename": "OpenURLAction",
				"url":        action.tapBehaviorUrl,
			}

		default:
			payload = M{
				"__typename": "PresentWebsiteAction",
				"url":        action.tapBehaviorUrl,
			}
		}

	default:
		payload = nil
	}

	return json.Marshal(payload)
}

type RoverNotification struct {
	Id         string `json:"id"`
	CampaignID int32  `json:"campaignID"`

	Title string `json:"title"`
	Body  string `json:"body"`

	Attachment *Attachment `json:"attachment,omitempty"`
	Action     *actionInfo `json:"action,omitempty"`

	DeliveredAt time.Time  `json:"deliveredAt"`
	ExpiresAt   *time.Time `json:"expiresAt"`

	IsRead                      bool `json:"isRead"`
	IsDeleted                   bool `json:"isDeleted"`
	IsNotificationCenterEnabled bool `json:"isNotificationCenterEnabled"`
}

func ToRoverNotification(settings *scylla.NotificationSettings, note *scylla.Notification) *RoverNotification {
	rn := &RoverNotification{
		Id: note.Id.String(),

		CampaignID: note.CampaignId,

		Title: note.Title,
		Body:  note.Body,

		Attachment: nil,

		Action: &actionInfo{
			tapBehaviorPresentationType: string(settings.TapBehaviorPresentationType),
			tapBehaviorUrl:              settings.TapBehaviorUrl,
			campaignId:                  int(settings.CampaignId),
			tapBehaviorType:             string(settings.TapBehaviorType),
		},

		DeliveredAt: note.CreatedAt(),

		// TODO?
		ExpiresAt: nil,

		IsNotificationCenterEnabled: settings.AlertOptionNotificationCenter,

		IsDeleted: note.IsDeleted,
		IsRead:    note.IsRead,
	}

	if !(settings.AttachmentUrl == "" || settings.AttachmentType == scylla.AttachmentType_NONE) {
		rn.Attachment = &Attachment{
			Type: string(settings.AttachmentType),
			Url:  settings.AttachmentUrl,
		}
	}

	return rn
}

type LegacyRoverNotification struct {
	ID         string                       `json:"id"`
	Type       string                       `json:"type"`
	Attributes LegacyNotificationAttributes `json:"attributes"`
}

type LegacyNotificationAttributes struct {
	NotificationText string            `json:"notification-text"`
	IosTitle         string            `json:"ios-title"`
	AndroidTitle     string            `json:"android-title"`
	Tags             []string          `json:"tags"`
	Read             bool              `json:"read"`
	SavedToInbox     bool              `json:"saved-to-inbox"`
	ContentType      string            `json:"content-type"`
	WebsiteURL       string            `json:"website-url"`
	DeepLinkURL      string            `json:"deep-link-url"`
	Timestamp        time.Time         `json:"timestamp"`
	Properties       map[string]string `json:"properties"`
	ExperienceID     string            `json:"experience-id"`
}

func ToLegacyRoverNotification(settings *scylla.NotificationSettings, note *scylla.Notification) *LegacyRoverNotification {
	var contentType string
	switch settings.TapBehaviorType {
	case scylla.TapBehaviorType_OPEN_APP:
		contentType = "custom"
	case scylla.TapBehaviorType_OPEN_DEEP_LINK:
		contentType = "deep-link"
	case scylla.TapBehaviorType_OPEN_WEBSITE:
		contentType = "website"
	case scylla.TapBehaviorType_OPEN_EXPERIENCE:
		contentType = "experience"
	default:
		contentType = "custom"
	}

	return &LegacyRoverNotification{
		ID:   note.Id.String(),
		Type: "messages",
		Attributes: LegacyNotificationAttributes{
			NotificationText: note.Body,
			IosTitle:         note.Title,
			AndroidTitle:     note.Title,
			Tags:             []string{},
			Read:             false,
			SavedToInbox:     settings.AlertOptionNotificationCenter,
			ContentType:      contentType,
			WebsiteURL:       settings.TapBehaviorUrl,
			DeepLinkURL:      settings.TapBehaviorUrl,
			Timestamp:        note.CreatedAt(),
			Properties:       settings.Attributes,
			ExperienceID:     settings.ExperienceId,
		},
	}
}
