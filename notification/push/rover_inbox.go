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

func roverInboxURL(url string) string {
	if !strings.HasPrefix(url, "rv-") {
		return url
	}

	var idx = strings.Index(url, "://")
	if idx == -1 {
		return url
	}

	var inboxUrl = "rv-inbox://" + url[idx+len("://"):]

	return inboxUrl
}
