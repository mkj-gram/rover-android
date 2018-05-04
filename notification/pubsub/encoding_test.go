package pubsub

import (
	"testing"

	"cloud.google.com/go/pubsub"
	"github.com/pkg/errors"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func Test_Marshall(t *testing.T) {

	type testMsg struct {
		Data  string
		Attrs map[string]string
	}

	tcases := []struct {
		exp testMsg
		in  Message
	}{
		{
			in: &PushMessage{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					BadgeCount:           1,
					PushToken:            "token",
					PushTokenEnvironment: "production",
					OsName:               "iOS",
					SdkVersion:           Version{1, 2, 3},
				},

				NotificationBody:  "hello world",
				NotificationTitle: "a title",

				CampaignID: 4,
				IsTest:     true,
			},

			exp: testMsg{
				Attrs: map[string]string{
					"notification_kind": "message",
				},
				Data: `{"device":{"account_id":2,"id":"id","push_token":"token","push_token_environment":"production","app_namespace":"app_ns","badge_count":1,"os_name":"iOS","sdk_version":{"major":1,"minor":2,"revision":3}},"campaign_id":4,"notification_body":"hello world","notification_title":"a title","is_test":true}`,
			},
		},

		{
			in: &SilentPush{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					BadgeCount:           1,
					PushToken:            "token",
					PushTokenEnvironment: "production",
					OsName:               "iOS",
					SdkVersion:           Version{1, 2, 3},
				},

				Payload: map[string]string{
					"hello": "world",
				},
			},

			exp: testMsg{
				Attrs: map[string]string{
					"notification_kind": "silent",
				},
				Data: `{"device":{"account_id":2,"id":"id","push_token":"token","push_token_environment":"production","app_namespace":"app_ns","badge_count":1,"os_name":"iOS","sdk_version":{"major":1,"minor":2,"revision":3}},"payload":{"hello":"world"}}`,
			},
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp = tc.exp
				pm  = &pubsub.Message{}

				gotErr = Marshal(tc.in, pm)
				got    = testMsg{
					Attrs: pm.Attributes,
					Data:  string(pm.Data),
				}
			)

			if diff := rtesting.Diff(exp, got, nil, gotErr); diff != nil {
				t.Errorf("\nDiff: %v\n", rtesting.Difff(diff))
			}
		})
	}
}

func Test_Unmarshal(t *testing.T) {
	tcases := []struct {
		in     *pubsub.Message
		exp    Message
		expErr error
	}{
		{
			in: &pubsub.Message{},

			expErr: errors.Errorf(`unknown kind: ""`),
		},

		{
			in: &pubsub.Message{
				Attributes: map[string]string{
					"notification_kind": "message",
				},
				Data: []byte(`{"device":{"account_id":2,"id":"id","push_token":"token","push_token_environment":"production","app_namespace":"app_ns","badge_count":1,"os_name":"iOS","sdk_version":{"major":1,"minor":2,"revision":3}},"campaign_id":4,"notification_body":"hello world","notification_title":"a title","is_test": true}`),
			},

			exp: &PushMessage{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					BadgeCount:           1,
					PushToken:            "token",
					PushTokenEnvironment: "production",
					OsName:               "iOS",
					SdkVersion:           Version{1, 2, 3},
				},

				NotificationBody:  "hello world",
				NotificationTitle: "a title",

				CampaignID: 4,
				IsTest:     true,
			},
		},

		{
			exp: &SilentPush{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					BadgeCount:           1,
					PushToken:            "token",
					PushTokenEnvironment: "production",
					OsName:               "iOS",
					SdkVersion:           Version{1, 2, 3},
				},
				Payload: map[string]string{
					"hello": "world",
				},
			},

			in: &pubsub.Message{
				Attributes: map[string]string{
					"notification_kind": "silent",
				},
				Data: []byte(`{"device":{"account_id":2,"id":"id","push_token":"token","push_token_environment":"production","app_namespace":"app_ns","badge_count":1,"os_name":"iOS","sdk_version":{"major":1,"minor":2,"revision":3}},"payload":{"hello":"world"}}`),
			},
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = Unmarshal(tc.in)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("\nDiff: %v\n", rtesting.Difff(diff))
			}
		})
	}
}
