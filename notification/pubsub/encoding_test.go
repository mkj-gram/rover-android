package pubsub

import (
	"bytes"
	"encoding/json"
	"testing"

	"cloud.google.com/go/pubsub"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func intPtr(v int32) *int32 {
	return &v
}

func jsonIndent(t *testing.T, s string) string {
	t.Helper()
	var buf bytes.Buffer
	if err := json.Indent(&buf, []byte(s), " ", " "); err != nil {
		t.Fatal(err)
	}

	return buf.String()
}

func Test_Marshall_Unmarshal(t *testing.T) {

	type msg struct {
		Data  string
		Attrs map[string]string
	}

	tcases := []struct {
		desc string
		exp  msg
		in   Message
	}{
		{
			desc: "",
			in: &PushMessage{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					AppBadgeNumber:       intPtr(1),
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

			exp: msg{
				Attrs: map[string]string{
					"notification_kind": "message",
				},
				Data: jsonIndent(t, `
				{
					"device": {
						"account_id": 2,
						"id": "id",
						"push_token": "token",
						"push_token_environment": "production",
						"app_namespace": "app_ns",
						"app_badge_number": 1,
						"os_name": "iOS",
						"sdk_version": {
							"major": 1,
							"minor": 2,
							"revision": 3
						}
					},
					"campaign_id": 4,
					"notification_body": "hello world",
					"notification_title": "a title",
					"is_test": true
				}`,
				),
			},
		},

		{
			desc: "with nil badge",
			in: &PushMessage{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					AppBadgeNumber:       nil,
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

			exp: msg{
				Attrs: map[string]string{
					"notification_kind": "message",
				},
				Data: jsonIndent(t, `
				{
					"device": {
						"account_id": 2,
						"id": "id",
						"push_token": "token",
						"push_token_environment": "production",
						"app_namespace": "app_ns",
						"os_name": "iOS",
						"sdk_version": {
						"major": 1,
						"minor": 2,
						"revision": 3
						}
					},
					"campaign_id": 4,
					"notification_body": "hello world",
					"notification_title": "a title",
					"is_test": true
				}`,
				),
			},
		},

		{
			desc: "",
			in: &SilentPush{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					AppBadgeNumber:       intPtr(1),
					PushToken:            "token",
					PushTokenEnvironment: "production",
					OsName:               "iOS",
					SdkVersion:           Version{1, 2, 3},
				},

				Payload: map[string]string{
					"hello": "world",
				},
			},

			exp: msg{
				Attrs: map[string]string{
					"notification_kind": "silent",
				},

				Data: jsonIndent(t, `
				{
					"device": {
						"account_id": 2,
						"id": "id",
						"push_token": "token",
						"push_token_environment": "production",
						"app_namespace": "app_ns",
						"app_badge_number": 1,
						"os_name": "iOS",
						"sdk_version": {
							"major": 1,
							"minor": 2,
							"revision": 3
						}
					},
					"payload": {
						"hello": "world"
					}
				}`,
				),
			},
		},

		{
			desc: "with nil badge",
			in: &SilentPush{
				Device: Device{
					ID:                   "id",
					AccountID:            2,
					AppNamespace:         "app_ns",
					AppBadgeNumber:       nil,
					PushToken:            "token",
					PushTokenEnvironment: "production",
					OsName:               "iOS",
					SdkVersion:           Version{1, 2, 3},
				},

				Payload: map[string]string{
					"hello": "world",
				},
			},

			exp: msg{
				Attrs: map[string]string{
					"notification_kind": "silent",
				},

				Data: jsonIndent(t, `
				{
					"device": {
						"account_id": 2,
						"id": "id",
						"push_token": "token",
						"push_token_environment": "production",
						"app_namespace": "app_ns",
						"os_name": "iOS",
						"sdk_version": {
							"major": 1,
							"minor": 2,
							"revision": 3
						}
					},
					"payload": {
						"hello": "world"
					}
				}`,
				),
			},
		},
	}

	for _, tc := range tcases {
		t.Run("Marshal", func(t *testing.T) {
			var (
				exp = tc.exp
				pm  = &pubsub.Message{}

				gotErr = Marshal(tc.in, pm)
				got    = msg{
					Attrs: pm.Attributes,
					Data:  jsonIndent(t, string(pm.Data)),
				}
			)

			if diff := rtesting.Diff(exp, got, nil, gotErr); diff != nil {
				t.Errorf("\nDiff: \n%v\n", rtesting.Difff(diff))
			}
		})

		t.Run("Unmarshal", func(t *testing.T) {
			var (
				exp = tc.in
				pm  = &pubsub.Message{
					Attributes: tc.exp.Attrs,
					Data:       []byte(tc.exp.Data),
				}

				got, gotErr = Unmarshal(pm)
			)

			if diff := rtesting.Diff(exp, got, nil, gotErr); diff != nil {
				t.Errorf("\nDiff: \n%v\n", rtesting.Difff(diff))
			}
		})
	}
}
