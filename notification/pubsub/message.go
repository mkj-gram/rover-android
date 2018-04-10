package pubsub

type Message interface {
	notification()
}

type SilentPush struct {
	Payload map[string]string `json:"payload"`
}

func (m *SilentPush) notification() {}

type PushMessage struct {
	NotificationBody  string `json:"notification_body"`
	NotificationTitle string `json:"notification_title"`

	DeviceId                   string `json:"device_id"`
	DevicePushToken            string `json:"device_push_token"`
	DevicePushTokenEnvironment string `json:"device_push_token_environment"`
	DeviceAppNamespace         string `json:"device_app_namespace"`
	DeviceBadgeCount           string `json:"device_badge_count"`

	// Either "iOS" or "Android"
	OsName string `json:"os_name"`

	SdkVersion Version `json:"sdk_version"`
}

func (m *PushMessage) notification() {}

type Version struct {
	Major    int32 `json:"major"`
	Minor    int32 `json:"minor"`
	Revision int32 `json:"revision"`
}
