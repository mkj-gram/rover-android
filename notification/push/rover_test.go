package push

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gocql/gocql"

	rtesting "github.com/roverplatform/rover/go/testing"
	"github.com/roverplatform/rover/notification/scylla"
)

var (
	Diff, Difff = rtesting.Diff, rtesting.Difff
)

func ts(t *testing.T, str string) *time.Time {
	tv, err := time.Parse(time.RFC3339, str)
	if err != nil {
		t.Fatal(err)
	}

	return &tv
}

func toJSON(t *testing.T, m interface{}) string {
	data, err := json.Marshal(m)
	if err != nil {
		t.Fatal(t)
	}

	return string(data)
}

func Test_roverInboxURL(t *testing.T) {

	tcases := []struct {
		in  string
		exp string
	}{
		{
			"rv-sharks://presentExperience?CampaignID=1",
			"rv-inbox://presentExperience?CampaignID=1",
		},

		{
			"http://google.com",
			"http://google.com",
		},
	}

	for _, tc := range tcases {
		t.Run(tc.in, func(t *testing.T) {
			var (
				exp = tc.exp
				got = roverInboxURL(tc.in)
			)

			if diff := rtesting.Diff(exp, got, nil, nil); diff != nil {
				t.Errorf("\nDiff: %v", diff)
			}
		})
	}
}

func Test_RoverPayload_MarshalJSON(t *testing.T) {
	tcases := []struct {
		in  interface{}
		exp string
	}{

		{
			in: &RoverNotification{
				Id:         "f944c7b4-3dcd-11e8-b467-0ed5f89f718b",
				CampaignID: "1",

				Title: "a title",
				Body:  "a body",

				TapBehavior: &tapBehaviorInfo{
					campaignId:      1,
					tapBehaviorType: "OPEN_APP",
				},

				IsRead:                      true,
				IsDeleted:                   true,
				IsNotificationCenterEnabled: true,
			},
			exp: `{"id":"f944c7b4-3dcd-11e8-b467-0ed5f89f718b","campaignID":"1","title":"a title","body":"a body","tapBehavior":{"__typename":"OpenAppNotificationTapBehavior"},"deliveredAt":"0001-01-01T00:00:00Z","expiresAt":null,"isRead":true,"isDeleted":true,"isNotificationCenterEnabled":true}`,
		},

		{
			in: &RoverNotification{
				Id:         "f944c7b4-3dcd-11e8-b467-0ed5f89f718b",
				CampaignID: "1",

				Title: "a title",
				Body:  "a body",

				Attachment: &Attachment{
					Type: "IMAGE",
					Url:  "http://example.com/img.png",
				},
				TapBehavior: &tapBehaviorInfo{
					campaignId:      1,
					tapBehaviorType: "OPEN_EXPERIENCE",
					tapBehaviorUrl:  "rv-inbox://presentExperience?campaignID=1",
				},
				DeliveredAt: *ts(t, "2018-03-01T01:02:03Z"),
				ExpiresAt:   ts(t, "2017-03-01T01:02:03Z"),

				IsRead:                      true,
				IsDeleted:                   true,
				IsNotificationCenterEnabled: true,
			},
			exp: `{"id":"f944c7b4-3dcd-11e8-b467-0ed5f89f718b","campaignID":"1","title":"a title","body":"a body","attachment":{"type":"IMAGE","url":"http://example.com/img.png"},"tapBehavior":{"__typename":"OpenURLNotificationTapBehavior","url":"rv-inbox://presentExperience?campaignID=1"},"deliveredAt":"2018-03-01T01:02:03Z","expiresAt":"2017-03-01T01:02:03Z","isRead":true,"isDeleted":true,"isNotificationCenterEnabled":true}`,
		},

		{
			in: &RoverNotification{
				Id:         "f944c7b4-3dcd-11e8-b467-0ed5f89f718b",
				CampaignID: "1",

				Title: "a title",
				Body:  "a body",

				Attachment: &Attachment{
					Type: "IMAGE",
					Url:  "http://example.com/img.png",
				},
				TapBehavior: &tapBehaviorInfo{
					campaignId:                  1,
					tapBehaviorType:             "OPEN_WEBSITE",
					tapBehaviorPresentationType: "IN_BROWSER",
					tapBehaviorUrl:              "http://hello.world",
				},
				DeliveredAt: *ts(t, "2018-03-01T01:02:03Z"),
				ExpiresAt:   ts(t, "2017-03-01T01:02:03Z"),

				IsRead:                      true,
				IsDeleted:                   true,
				IsNotificationCenterEnabled: true,
			},
			exp: `{"id":"f944c7b4-3dcd-11e8-b467-0ed5f89f718b","campaignID":"1","title":"a title","body":"a body","attachment":{"type":"IMAGE","url":"http://example.com/img.png"},"tapBehavior":{"__typename":"OpenURLNotificationTapBehavior","url":"http://hello.world"},"deliveredAt":"2018-03-01T01:02:03Z","expiresAt":"2017-03-01T01:02:03Z","isRead":true,"isDeleted":true,"isNotificationCenterEnabled":true}`,
		},

		{
			in: &RoverNotification{
				Id:         "f944c7b4-3dcd-11e8-b467-0ed5f89f718b",
				CampaignID: "1",

				Title: "a title",
				Body:  "a body",

				Attachment: &Attachment{
					Type: "IMAGE",
					Url:  "http://example.com/img.png",
				},
				TapBehavior: &tapBehaviorInfo{
					campaignId:                  1,
					tapBehaviorType:             "OPEN_WEBSITE",
					tapBehaviorPresentationType: "IN_APP",
					tapBehaviorUrl:              "http://hello.world",
				},
				DeliveredAt: *ts(t, "2018-03-01T01:02:03Z"),
				ExpiresAt:   ts(t, "2017-03-01T01:02:03Z"),

				IsRead:                      true,
				IsDeleted:                   true,
				IsNotificationCenterEnabled: true,
			},
			exp: `{"id":"f944c7b4-3dcd-11e8-b467-0ed5f89f718b","campaignID":"1","title":"a title","body":"a body","attachment":{"type":"IMAGE","url":"http://example.com/img.png"},"tapBehavior":{"__typename":"PresentWebsiteNotificationTapBehavior","url":"http://hello.world"},"deliveredAt":"2018-03-01T01:02:03Z","expiresAt":"2017-03-01T01:02:03Z","isRead":true,"isDeleted":true,"isNotificationCenterEnabled":true}`,
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr  = tc.exp, (error)(nil)
				data, gotErr = json.Marshal(tc.in)
				got          = string(data)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatal("\nDiff:\n", Difff(diff))
			}
		})
	}
}

func TestToLegacyRoverNotification(t *testing.T) {
	var id, err = gocql.ParseUUID("f944c7b4-3dcd-11e8-b467-0ed5f89f718b")
	if err != nil {
		t.Fatal(err)
	}

	var tests = []struct {
		name     string
		settings *scylla.NotificationSettings
		note     *scylla.Notification
		exp      string
	}{

		{
			name: "returns empty properties object when attributes are nil",
			settings: &scylla.NotificationSettings{
				CampaignId:     1,
				AccountID:      1,
				ExperienceId:   "abc123",
				AttachmentUrl:  "https://google.ca/cat.png",
				AttachmentType: scylla.AttachmentType_IMAGE,

				TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
				TapBehaviorUrl:              "rv-acct_1://presentExperience?campaignID=1",
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,

				IosContentAvailable:           true,
				IosMutableContent:             true,
				IosSound:                      "sound-file.wav",
				IosCategoryIdentifier:         "category",
				IosThreadIdentifier:           "thread",
				AndroidChannelId:              "channel-id",
				AndroidSound:                  "sound-file.android",
				AndroidTag:                    "android-tag",
				Expiration:                    -1,
				Attributes:                    nil,
				AlertOptionPushNotification:   true,
				AlertOptionNotificationCenter: false,
				AlertOptionBadgeNumber:        true,
			},
			note: &scylla.Notification{
				Id:         id,
				AccountId:  1,
				CampaignId: 1,
				Title:      "title",
				Body:       "body",
				IsRead:     false,
			},
			exp: `{"id":"f944c7b4-3dcd-11e8-b467-0ed5f89f718b","type":"messages","attributes":{"notification-text":"body","ios-title":"title","android-title":"title","tags":[],"read":false,"saved-to-inbox":false,"content-type":"experience","website-url":"","deep-link-url":"","timestamp":"2018-04-11T21:19:09.44245Z","properties":{},"experience-id":"abc123"}}`,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				exp, expErr  = test.exp, (error)(nil)
				data, gotErr = json.Marshal(ToLegacyRoverNotification(test.settings, test.note))
				got          = string(data)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatal("\nDiff:\n", Difff(diff))
			}
		})
	}
}
