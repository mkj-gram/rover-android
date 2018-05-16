package push_test

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	fcm "github.com/appleboy/go-fcm"
	"github.com/gocql/gocql"
	"github.com/golang/mock/gomock"
	"github.com/karlseguin/ccache"
	"github.com/sideshow/apns2"

	rtesting "github.com/roverplatform/rover/go/testing"
	"github.com/roverplatform/rover/notification/postgres"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/push"
	mocks "github.com/roverplatform/rover/notification/push/mocks"
	"github.com/roverplatform/rover/notification/scylla"
)

func uuid(t *testing.T, str string) scylla.UUID {
	t.Helper()

	id, err := gocql.ParseUUID(str)
	if err != nil {
		t.Fatal(err)
	}

	return id
}

func toBase64(t *testing.T, data []byte) string {
	t.Helper()

	return base64.StdEncoding.EncodeToString(data)
}

func makeNotificationSettings(fn func(t *scylla.NotificationSettings)) *scylla.NotificationSettings {
	var defaultNS = &scylla.NotificationSettings{
		CampaignId:                  1,
		AccountID:                   1,
		ExperienceId:                "abc123",
		AttachmentUrl:               "https://google.ca/cat.png",
		AttachmentType:              scylla.AttachmentType_IMAGE,
		TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
		TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
		IosContentAvailable:         true,
		IosMutableContent:           true,
		IosSound:                    "sound-file.wav",
		IosCategoryIdentifier:       "category",
		IosThreadIdentifier:         "thread",
		AndroidChannelId:            "channel-id",
		AndroidSound:                "sound-file.android",
		AndroidTag:                  "android-tag",
		Expiration:                  99,
		Attributes: map[string]string{
			"value1": "something",
			"value2": "another",
		},
		AlertOptionPushNotification:   true,
		AlertOptionNotificationCenter: false,
		AlertOptionBadgeNumber:        true,
	}

	if fn != nil {
		fn(defaultNS)
	}

	return defaultNS
}

type M = map[string]interface{}

func parseJSON(t *testing.T, v []byte) M {
	t.Helper()

	var m M
	if err := json.Unmarshal(v, &m); err != nil {
		t.Log("parseJSON:", err)
	}

	return m
}

func readFile(t *testing.T, path string) []byte {
	t.Helper()
	data, err := ioutil.ReadFile(path)
	if err != nil {
		t.Error(err)
	}

	return data
}

func certP12(t *testing.T, path string) []byte {
	t.Helper()
	return readFile(t, path)
}

func ts(t *testing.T, s string) time.Time {
	t.Helper()

	tsv, err := time.Parse(time.RFC3339, s)
	if err != nil {
		t.Fatal(err)
	}

	return tsv
}

func TestHandler(t *testing.T) {

	var (
		sdkVersion = notification_pubsub.Version{Major: 2, Minor: 2, Revision: 3}
		ctx        = context.TODO()

		timeNow = time.Now()

		oldTimeUUID = scylla.TimeUUID
	)

	scylla.TimeUUID = func() scylla.UUID {
		return uuid(t, "09702289-4329-11e8-a214-784f43835469")
	}

	defer func() {
		scylla.TimeUUID = oldTimeUUID
	}()

	type mocked struct {
		*mocks.MocknotificationSettingsStore
		*mocks.MocknotificationsStore
		*mocks.MockAndroidPlatformStore
		*mocks.MockIosPlatformStore
	}

	type (
		HTTPRequest struct {
			Headers http.Header
			Body    M
		}
		HTTPResponse struct {
			Status  int
			Headers http.Header
			Body    M
		}
	)

	tcases := []struct {
		desc string

		message    notification_pubsub.Message
		setupMocks func(m mocked)

		serverResponse http.HandlerFunc

		androidPlatformStore push.AndroidPlatformStore
		iosPlatformStore     push.IosPlatformStore

		expReq *HTTPRequest

		expErr error
	}{
		{
			desc: "FCM sdk 1.0 request",

			message: &notification_pubsub.PushMessage{
				CampaignID:        1,
				NotificationBody:  "a body",
				NotificationTitle: "a title",
				Device: notification_pubsub.Device{
					AccountID:            1,
					AppNamespace:         "hello",
					BadgeCount:           2,
					ID:                   "device_id",
					OsName:               "Android",
					PushToken:            "pushtoken",
					PushTokenEnvironment: "production",
					SdkVersion:           notification_pubsub.Version{Major: 1},
				},
				IsTest: true,
			},

			expReq: &HTTPRequest{
				Headers: http.Header{
					"User-Agent":      []string{"Go-http-client/1.1"},
					"Content-Length":  []string{"486"},
					"Authorization":   []string{"key=server_key"},
					"Content-Type":    []string{"application/json"},
					"Accept-Encoding": []string{"gzip"},
				},
				Body: M{
					"to":           "pushtoken",
					"collapse_key": "channel-id",

					"data": M{
						"_rover": true,
						"message": M{
							"id":   "09702289-4329-11e8-a214-784f43835469",
							"type": "messages",
							"attributes": M{
								"notification-text": "a body",
								"ios-title":         "a title",
								"android-title":     "a title",
								"tags":              []interface{}{},
								"read":              false,
								"saved-to-inbox":    false,
								"content-type":      "experience",
								"deep-link-url":     "",
								"website-url":       "",
								"properties": M{
									"value1": "something",
									"value2": "another",
								},
								"experience-id": "5b10eda90000000000000000",
								"timestamp":     "2018-04-18T16:53:36.5864073Z",
							},
						},
					},
				},
			},

			serverResponse: func(rw http.ResponseWriter, req *http.Request) {
				rw.WriteHeader(http.StatusOK)
				rw.Header().Set("Content-Type", "application/json")
				fmt.Fprint(rw, `{
													"success": 1,
													"failure":0,
													"results": [{
														"message_id":"q1w2e3r4",
														"registration_id": "t5y6u7i8o9",
														"error": ""
													}]
												}`)
			},

			setupMocks: func(m mocked) {

				m.MocknotificationSettingsStore.
					EXPECT().OneById(ctx, int32(1)).
					Return(
						makeNotificationSettings(func(t *scylla.NotificationSettings) {
							t.TapBehaviorType = scylla.TapBehaviorType_OPEN_EXPERIENCE
							t.ExperienceId = "5b10eda90000000000000000"
						}),
						nil,
					)

				notification := scylla.Notification{
					AccountId:  1,
					CampaignId: 1,
					DeviceId:   "device_id",
					Id:         uuid(t, "09702289-4329-11e8-a214-784f43835469"),
					IsDeleted:  false,
					IsRead:     false,
					Body:       "a body",
					Title:      "a title",
					IsTest:     true,
				}

				m.MocknotificationsStore.
					EXPECT().Create(ctx, &notification).
					Return(
						nil,
					)

				m.MockAndroidPlatformStore.
					EXPECT().
					ListByAccountId(ctx, int32(1)).
					Return(
						[]*postgres.AndroidPlatform{
							&postgres.AndroidPlatform{
								Id:        1,
								AccountId: 1,
								CreatedAt: timeNow,
								UpdatedAt: timeNow,
								Title:     "a key",
								PushCredentialsSenderId:  "server_sender_id",
								PushCredentialsServerKey: "server_key",
								PushCredentialsUpdatedAt: timeNow,
							},
						},
						nil,
					)
			},
		},

		{
			desc: "FCM sdk 2.0 request",

			message: &notification_pubsub.PushMessage{
				CampaignID:        1,
				NotificationBody:  "a body",
				NotificationTitle: "a title",
				Device: notification_pubsub.Device{
					AccountID:            1,
					AppNamespace:         "hello",
					BadgeCount:           2,
					ID:                   "device_id",
					OsName:               "Android",
					PushToken:            "pushtoken",
					PushTokenEnvironment: "production",
					SdkVersion:           sdkVersion,
				},
			},

			expReq: &HTTPRequest{
				Headers: http.Header{
					"User-Agent":      []string{"Go-http-client/1.1"},
					"Content-Length":  []string{"413"},
					"Authorization":   []string{"key=server_key"},
					"Content-Type":    []string{"application/json"},
					"Accept-Encoding": []string{"gzip"},
				},
				Body: M{
					"to":           "pushtoken",
					"collapse_key": "channel-id",

					"data": M{
						"rover": M{
							"notification": M{
								"id":         "09702289-4329-11e8-a214-784f43835469",
								"campaignID": float64(1),
								"title":      "a title",
								"body":       "a body",
								"attachment": M{
									"type": "IMAGE",
									"url":  "https://google.ca/cat.png",
								},
								"actionInfo":                  M{"type": "", "attributes": nil},
								"deliveredAt":                 "2018-04-18T16:53:36.5864073Z",
								"expiresAt":                   nil,
								"isRead":                      false,
								"isDeleted":                   false,
								"isNotificationCenterEnabled": false,
							},
						},
					},
				},
			},

			serverResponse: func(rw http.ResponseWriter, req *http.Request) {
				rw.WriteHeader(http.StatusOK)
				rw.Header().Set("Content-Type", "application/json")
				fmt.Fprint(rw, `{
													"success": 1,
													"failure":0,
													"results": [{
														"message_id":"q1w2e3r4",
														"registration_id": "t5y6u7i8o9",
														"error": ""
													}]
												}`)
			},

			setupMocks: func(m mocked) {

				m.MocknotificationSettingsStore.
					EXPECT().OneById(ctx, int32(1)).
					Return(
						makeNotificationSettings(nil),
						nil,
					)

				notification := scylla.Notification{
					AccountId:  1,
					CampaignId: 1,
					DeviceId:   "device_id",
					Id:         uuid(t, "09702289-4329-11e8-a214-784f43835469"),
					IsDeleted:  false,
					IsRead:     false,
					Body:       "a body",
					Title:      "a title",
				}

				m.MocknotificationsStore.
					EXPECT().Create(ctx, &notification).
					Return(
						nil,
					)

				m.MockAndroidPlatformStore.
					EXPECT().
					ListByAccountId(ctx, int32(1)).
					Return(
						[]*postgres.AndroidPlatform{
							&postgres.AndroidPlatform{
								Id:        1,
								AccountId: 1,
								CreatedAt: timeNow,
								UpdatedAt: timeNow,
								Title:     "a key",
								PushCredentialsSenderId:  "server_sender_id",
								PushCredentialsServerKey: "server_key",
								PushCredentialsUpdatedAt: timeNow,
							},
						},
						nil,
					)
			},
		},

		{
			desc: "APNS sdk 1.0 request",

			message: &notification_pubsub.PushMessage{
				CampaignID:        1,
				NotificationBody:  "a body",
				NotificationTitle: "a title",
				Device: notification_pubsub.Device{
					AccountID:            1,
					AppNamespace:         "io.rover.Bagel",
					BadgeCount:           2,
					ID:                   "device_id",
					OsName:               "iOS",
					PushToken:            "pushtoken",
					PushTokenEnvironment: "test",
					SdkVersion:           notification_pubsub.Version{Major: 1},
				},
			},

			expReq: &HTTPRequest{

				Headers: http.Header{
					"User-Agent":       []string{"Go-http-client/1.1"},
					"Content-Length":   []string{"608"},
					"Apns-Collapse-Id": []string{"thread"},
					"Apns-Id":          []string{"09702289-4329-11e8-a214-784f43835469"},
					"Apns-Topic":       []string{"io.rover.Bagel"},
					"Content-Type":     []string{"application/json; charset=utf-8"},
					"Accept-Encoding":  []string{"gzip"},
				},
				Body: M{
					"aps": M{
						"alert": M{
							"body":  "a body",
							"title": "a title",
						},
						"badge":             float64(2),
						"category":          "category",
						"content-available": float64(1),
						"mutable-content":   float64(1),
						"sound":             "sound-file.wav",
						"thread-id":         "thread",
					},
					"_rover": true,
					"data": M{
						"id":   "09702289-4329-11e8-a214-784f43835469",
						"type": "messages",
						"attributes": M{
							"notification-text": "a body",
							"ios-title":         "a title",
							"android-title":     "a title",
							"tags":              []interface{}{},
							"read":              false,
							"saved-to-inbox":    false,
							"content-type":      "website",
							"deep-link-url":     "https://google.ca",
							"website-url":       "https://google.ca",
							"properties": M{
								"value1": "something",
								"value2": "another",
							},
							"experience-id": "",
							"timestamp":     "2018-04-18T16:53:36.5864073Z",
						},
					},
				},
			},

			serverResponse: func(rw http.ResponseWriter, req *http.Request) {
				rw.WriteHeader(http.StatusOK)
			},

			setupMocks: func(m mocked) {

				m.MocknotificationSettingsStore.
					EXPECT().OneById(ctx, int32(1)).
					Return(
						makeNotificationSettings(func(t *scylla.NotificationSettings) {
							t.TapBehaviorType = scylla.TapBehaviorType_OPEN_WEBSITE
							t.TapBehaviorUrl = "https://google.ca"
							t.ExperienceId = ""
						}),
						nil,
					)

				notification := scylla.Notification{
					AccountId:  1,
					CampaignId: 1,
					DeviceId:   "device_id",
					Id:         uuid(t, "09702289-4329-11e8-a214-784f43835469"),
					IsDeleted:  false,
					IsRead:     false,
					Body:       "a body",
					Title:      "a title",
				}

				m.MocknotificationsStore.
					EXPECT().Create(ctx, &notification).
					Return(
						nil,
					)

				var expiresAt = ts(t, "2018-10-28T13:15:13-04:00")

				m.MockIosPlatformStore.
					EXPECT().
					ListByAccountId(ctx, int32(1)).
					Return(
						[]*postgres.IosPlatform{
							&postgres.IosPlatform{
								Id:        1,
								AccountId: 1,

								CreatedAt: timeNow,
								UpdatedAt: timeNow,

								BundleId: "io.rover.Bagel",

								CertificateData:       toBase64(t, certP12(t, "../grpc/testdata/io.rover.Bagel.p12")),
								CertificateFilename:   "cert2",
								CertificatePassphrase: "",
								CertificateExpiresAt:  &expiresAt,
								CertificateUpdatedAt:  timeNow,
							},
						},
						nil,
					)
			},
		},

		{
			desc: "APNS sdk 2.0 request",

			message: &notification_pubsub.PushMessage{
				CampaignID:        1,
				NotificationBody:  "a body",
				NotificationTitle: "a title",
				Device: notification_pubsub.Device{
					AccountID:            1,
					AppNamespace:         "io.rover.Bagel",
					BadgeCount:           2,
					ID:                   "device_id",
					OsName:               "iOS",
					PushToken:            "pushtoken",
					PushTokenEnvironment: "test",
					SdkVersion:           sdkVersion,
				},
			},

			expReq: &HTTPRequest{

				Headers: http.Header{
					"User-Agent":       []string{"Go-http-client/1.1"},
					"Content-Length":   []string{"531"},
					"Apns-Collapse-Id": []string{"thread"},
					"Apns-Id":          []string{"09702289-4329-11e8-a214-784f43835469"},
					"Apns-Topic":       []string{"io.rover.Bagel"},
					"Content-Type":     []string{"application/json; charset=utf-8"},
					"Accept-Encoding":  []string{"gzip"},
				},
				Body: M{
					"aps": M{
						"alert": M{
							"body":  "a body",
							"title": "a title",
						},
						"badge":             float64(2),
						"category":          "category",
						"content-available": float64(1),
						"mutable-content":   float64(1),
						"sound":             "sound-file.wav",
						"thread-id":         "thread",
					},
					"rover": M{
						"notification": M{
							"id":         "09702289-4329-11e8-a214-784f43835469",
							"campaignID": float64(1),
							"body":       "a body",
							"title":      "a title",
							"actionInfo": M{
								"type":       "",
								"attributes": nil,
							},
							"deliveredAt": "2018-04-18T16:53:36.5864073Z",

							"attachment": M{
								"type": "IMAGE",
								"url":  "https://google.ca/cat.png",
							},
							"expiresAt":                   nil,
							"isRead":                      false,
							"isDeleted":                   false,
							"isNotificationCenterEnabled": false,
						},
					},
				},
			},

			serverResponse: func(rw http.ResponseWriter, req *http.Request) {
				rw.WriteHeader(http.StatusOK)
			},

			setupMocks: func(m mocked) {

				m.MocknotificationSettingsStore.
					EXPECT().OneById(ctx, int32(1)).
					Return(
						makeNotificationSettings(nil),
						nil,
					)

				notification := scylla.Notification{
					AccountId:  1,
					CampaignId: 1,
					DeviceId:   "device_id",
					Id:         uuid(t, "09702289-4329-11e8-a214-784f43835469"),
					IsDeleted:  false,
					IsRead:     false,
					Body:       "a body",
					Title:      "a title",
				}

				m.MocknotificationsStore.
					EXPECT().Create(ctx, &notification).
					Return(
						nil,
					)

				var expiresAt = ts(t, "2018-10-28T13:15:13-04:00")

				m.MockIosPlatformStore.
					EXPECT().
					ListByAccountId(ctx, int32(1)).
					Return(
						[]*postgres.IosPlatform{
							&postgres.IosPlatform{
								Id:        1,
								AccountId: 1,

								CreatedAt: timeNow,
								UpdatedAt: timeNow,

								BundleId: "io.rover.Bagel",

								CertificateData:       toBase64(t, certP12(t, "../grpc/testdata/io.rover.Bagel.p12")),
								CertificateFilename:   "cert2",
								CertificatePassphrase: "",
								CertificateExpiresAt:  &expiresAt,
								CertificateUpdatedAt:  timeNow,
							},
						},
						nil,
					)
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				gotReq = new(HTTPRequest)

				server = httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
					data, err := ioutil.ReadAll(req.Body)
					if err != nil {
						t.Fatal(err)
					}

					gotReq.Headers = req.Header
					gotReq.Body = parseJSON(t, data)

					if tc.serverResponse != nil {
						tc.serverResponse(rw, req)
					}

				}))

				ctl = gomock.NewController(t)
				m   = mocked{
					MockAndroidPlatformStore:      mocks.NewMockAndroidPlatformStore(ctl),
					MockIosPlatformStore:          mocks.NewMockIosPlatformStore(ctl),
					MocknotificationSettingsStore: mocks.NewMocknotificationSettingsStore(ctl),
					MocknotificationsStore:        mocks.NewMocknotificationsStore(ctl),
				}

				clientFactory = &push.ClientFactory{
					Cache: ccache.New(ccache.Configure().MaxSize(10000)),
					AndroidPlatformsStore: m.MockAndroidPlatformStore,
					IosPlatformsStore:     m.MockIosPlatformStore,

					NewAPNSClient: func(p *postgres.IosPlatform) (*apns2.Client, error) {
						c, err := push.NewAPNSClient(p)
						if err != nil {
							return nil, err
						}
						c.Host = server.URL
						c.HTTPClient = http.DefaultClient
						// t.Logf("%v", c)
						return c, err
					},

					NewFCMClient: func(p *postgres.AndroidPlatform) (*fcm.Client, error) {
						return fcm.NewClient(p.PushCredentialsServerKey, fcm.WithEndpoint(server.URL))
					},
				}

				handler = &push.Handler{
					ClientFactory:             clientFactory,
					NotificationSettingsStore: m.MocknotificationSettingsStore,
					NotificationsStore:        m.MocknotificationsStore,
				}
			)

			if tc.setupMocks != nil {
				tc.setupMocks(m)
			}

			var (
				exp, expErr = tc.expReq, tc.expErr
				got         = gotReq
				gotErr      = handler.Handle(context.TODO(), tc.message)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Error("Diff:\n", rtesting.Difff(diff))
			}

			ctl.Finish()
		})
	}
}
