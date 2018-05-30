package push

import "strings"

// RoverInbox predefined credentials
// NOTE: must be set from an entry point
var RoverInbox struct {
	APNS struct {
		CertData string
		CertKey  string
	}

	FCM struct {
		ServerKey string
		SenderId  string
	}
}

func isRoverInboxIOSApp(bundleId string) bool {
	return bundleId == "io.rover.Inbox"
}

func isRoverInboxAndroidApp(packageName string) bool {
	const PackageName = "io.rover.app.inbox"
	return packageName == PackageName || strings.HasPrefix(packageName, PackageName+".")
}