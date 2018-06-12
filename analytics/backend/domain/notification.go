package domain

// notification_sent index by <delivered,unreachable,invalid>

// notifications_open index by <direct,influenced>

type NotificationSentResult string

const (
	NotificationSentResult_DELIVERED   = "delivered"
	NotificationSentResult_UNREACHABLE = "unreachable"
	NotificationSentResult_INVALID     = "invalid"
)

type NotificationSentRecord struct {
	Record
	Result NotificationSentResult
}

type NotificationOpenType string

const (
	NotificationOpenType_DIRECT     = "direct"
	NotificationOpenType_INFLUENCED = "influenced"
)

type NotificationOpenedRecord struct {
	Record
	Type NotificationOpenType
}
