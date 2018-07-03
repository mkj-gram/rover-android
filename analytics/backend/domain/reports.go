package domain

type Date string

func (d Date) String() string {
	return string(d)
}

type NotificationOpenedReport struct {
	Total  int
	Unique int

	NotificationCenterTotal  int
	NotificationCenterUnique int

	PushDirectTotal  int
	PushDirectUnique int

	PushInfluencedTotal  int
	PushInfluencedUnique int
}

type NotificationOpenedByDateReport struct {
	Reports map[Date]struct {
		NotificationCenter int
		PushDirect         int
		PushInfluenced     int
	}
}

type NotificationSentReport struct {
	// Total delivered
	TotalDelivered int
	// Unique delivered
	UniqueDelivered int

	NotificationCenterAttempted   int
	NotificationCenterDelivered   int
	NotificationCenterUnreachable int
	NotificationCenterInvalid     int

	PushAttempted   int
	PushDelivered   int
	PushUnreachable int
	PushInvalid     int
}
