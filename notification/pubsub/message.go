package pubsub

type Version struct {
	Major    int32 `json:"major"`
	Minor    int32 `json:"minor"`
	Revision int32 `json:"revision"`
}

type Device struct {
	AccountID            int    `json:"account_id"`
	ID                   string `json:"id"`
	PushToken            string `json:"push_token"`
	PushTokenEnvironment string `json:"push_token_environment"`
	AppNamespace         string `json:"app_namespace"`
	AppBadgeNumber       *int32 `json:"app_badge_number,omitempty"`

	OsName     string  `json:"os_name"`
	SdkVersion Version `json:"sdk_version"`
}

type Message interface {
	notification()
}

type SilentPush struct {
	Device  Device            `json:"device"`
	Payload map[string]string `json:"payload"`
}

func (m *SilentPush) notification() {}

type PushMessage struct {
	Device Device `json:"device"`
	// Used to lookup notification settings
	CampaignID        int    `json:"campaign_id"`
	NotificationBody  string `json:"notification_body"`
	NotificationTitle string `json:"notification_title"`

	IsTest bool `json:"is_test"`
}

func (m *PushMessage) notification() {}
