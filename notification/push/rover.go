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

	DelivetedAt time.Time  `json:"deliveredAt"`
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

		DelivetedAt: note.CreatedAt(),

		// TODO?
		ExpiresAt: nil,

		IsNotificationCenterEnabled: settings.AlertOptionNotificationCenter,

		IsDeleted: note.IsDeleted,
		IsRead:    note.IsRead,
	}
}
