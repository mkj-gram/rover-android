package push

import (
	"time"

	"github.com/roverplatform/rover/notification/scylla"
)

type Attachment struct {
	Type string `json:"type"`
	Url  string `json:"url"`
}

type ActionInfo struct {
	Type       string            `json:"type"`
	Attributes map[string]string `json:"attributes"`
}

type RoverNotification struct {
	Id         string `json:"id"`
	CampaignID int32  `json:"campaignID"`

	Title string `json:"title"`
	Body  string `json:"body"`

	Attachment *Attachment `json:"attachment,omitempty"`
	ActionInfo *ActionInfo `json:"actionInfo,omitempty"`

	DeliveredAt time.Time  `json:"deliveredAt"`
	ExpiresAt   *time.Time `json:"expiresAt"`

	IsRead                      bool `json:"isRead"`
	IsDeleted                   bool `json:"isDeleted"`
	IsNotificationCenterEnabled bool `json:"isNotificationCenterEnabled"`
}

func ToRoverNotification(settings *scylla.NotificationSettings, note *scylla.Notification) *RoverNotification {
	return &RoverNotification{
		Id: note.Id.String(),

		CampaignID: note.CampaignId,

		Title: note.Title,
		Body:  note.Body,

		Attachment: &Attachment{
			Type: string(settings.AttachmentType),
			Url:  settings.AttachmentUrl,
		},

		// TODO:
		ActionInfo: &ActionInfo{},

		DeliveredAt: note.CreatedAt(),

		// TODO?
		ExpiresAt: nil,

		IsNotificationCenterEnabled: settings.AlertOptionNotificationCenter,

		IsDeleted: note.IsDeleted,
		IsRead:    note.IsRead,
	}
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
