package push

import (
	"encoding/json"
	"testing"
	"time"

	rtesting "github.com/roverplatform/rover/go/testing"
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

func Test_RoverPayload_MarshalJSON(t *testing.T) {
	type M map[string]interface{}

	tcases := []struct {
		in  interface{}
		exp string
	}{
		{
			in: &RoverNotification{
				Id:         "f944c7b4-3dcd-11e8-b467-0ed5f89f718b",
				CampaignID: 1,

				Title: "a title",
				Body:  "a body",

				Attachment: &Attachment{
					Type: "IMAGE",
					Url:  "http://example.com/img.png",
				},
				ActionInfo: &ActionInfo{
					Attributes: map[string]string{"a": "1"},
					Type:       "openURL",
				},
				DelivetedAt: *ts(t, "2018-03-01T01:02:03Z"),
				ExpiresAt:   ts(t, "2017-03-01T01:02:03Z"),

				IsRead:                      true,
				IsDeleted:                   true,
				IsNotificationCenterEnabled: true,
			},
			exp: `{"id":"f944c7b4-3dcd-11e8-b467-0ed5f89f718b","campaignID":1,"title":"a title","body":"a body","attachment":{"type":"IMAGE","url":"http://example.com/img.png"},"actionInfo":{"type":"openURL","attributes":{"a":"1"}},"deliveredAt":"2018-03-01T01:02:03Z","expiresAt":"2017-03-01T01:02:03Z","isRead":true,"isDeleted":true,"isNotificationCenterEnabled":true}`,
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