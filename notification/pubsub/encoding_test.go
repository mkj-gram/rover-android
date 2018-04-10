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
				DeviceId:                   "id",
				DeviceAppNamespace:         "app_ns",
				DeviceBadgeCount:           "1",
				DevicePushToken:            "token",
				DevicePushTokenEnvironment: "prod",
				NotificationBody:           "hello world",
				NotificationTitle:          "a title",
				OsName:                     "ios",
				SdkVersion:                 Version{1, 2, 3},
			},

			exp: testMsg{
				Attrs: map[string]string{
					"notification_kind": "message",
				},
				Data: `{"notification_body":"hello world","notification_title":"a title","device_id":"id","device_push_token":"token","device_push_token_environment":"prod","device_app_namespace":"app_ns","device_badge_count":"1","os_name":"ios","sdk_version":{"major":1,"minor":2,"revision":3}}`,
			},
		},

		{
			in: &SilentPush{
				Payload: map[string]string{
					"hello": "world",
				},
			},

			exp: testMsg{
				Attrs: map[string]string{
					"notification_kind": "silent",
				},
				Data: `{"payload":{"hello":"world"}}`,
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
				Data: []byte(`{"notification_body":"hello world","notification_title":"a title","device_id":"id","device_push_token":"token","device_push_token_environment":"prod","device_app_namespace":"app_ns","device_badge_count":"1","os_name":"ios","sdk_version":{"major":1,"minor":2,"revision":3}}`),
			},

			exp: &PushMessage{
				DeviceId:                   "id",
				DeviceAppNamespace:         "app_ns",
				DeviceBadgeCount:           "1",
				DevicePushToken:            "token",
				DevicePushTokenEnvironment: "prod",
				NotificationBody:           "hello world",
				NotificationTitle:          "a title",
				OsName:                     "ios",
				SdkVersion:                 Version{1, 2, 3},
			},
		},

		{
			exp: &SilentPush{
				Payload: map[string]string{
					"hello": "world",
				},
			},

			in: &pubsub.Message{
				Attributes: map[string]string{
					"notification_kind": "silent",
				},
				Data: []byte(`{"payload":{"hello":"world"}}`),
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
