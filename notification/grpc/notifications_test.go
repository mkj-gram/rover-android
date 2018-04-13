package grpc_test

import (
	"context"
	"errors"
	"fmt"
	"github.com/golang/mock/gomock"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/apis/go/protobuf"
	"github.com/roverplatform/rover/notification/grpc"
	"github.com/roverplatform/rover/notification/grpc/mocks"
	"github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"testing"
)

type DB struct {
	store *mocks.MockNotificationSettingsStore
}

func (db *DB) NotificationSettingsStore() grpc.NotificationSettingsStore {
	return db.store
}

// DiffMatcher is the same as gomock.Eq except it outputs a readable diff between the two values
type DiffMatcher struct {
	Want interface{}

	diff []string
}

func (d *DiffMatcher) Matches(x interface{}) bool {
	if diff := Diff(d.Want, x, nil, nil); diff != nil {
		d.diff = diff
		return false
	}
	return true
}

func (d *DiffMatcher) String() string {
	return fmt.Sprintf("%v\nDiff:\n%v", d.Want, Difff(d.diff))
}

func Test_SendCampaignNotification(t *testing.T) {

	tests := []struct {
		name string

		req *notification.SendCampaignNotificationRequest

		dbExpect func(store *mocks.MockNotificationSettingsStore, pub *mocks.MockPublisher)
		exp      *notification.SendCampaignNotificationResponse
		expError error
	}{
		{
			name: "saves notification settings",
			req: &notification.SendCampaignNotificationRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				CampaignId:   1,
				ExperienceId: "1h3sk21vjxdghd73b",

				NotificationAttachmentUrl:   "https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
				NotificationAttachmentType:  notification.NotificationAttachmentType_IMAGE,
				NotificationTapBehaviorType: notification.NotificationTapBehaviorType_OPEN_EXPERIENCE,

				NotificationIosContentAvailable:   false,
				NotificationIosMutableContent:     true,
				NotificationIosCategoryIdentifier: "ios-category",
				NotificationIosSound:              "sound.wav",
				NotificationIosThreadIdentifier:   "ios-thread",

				NotificationAndroidChannelId: "android-channel",
				NotificationAndroidTag:       "mytag",
				NotificationAndroidSound:     "sound.wav",

				NotificationExpiration: -1,
				NotificationAttributes: map[string]string{
					"value1": "hello",
					"value2": "nope",
				},

				NotificationAlertOptionPushNotification:   true,
				NotificationAlertOptionNotificationCenter: true,
				NotificationAlertOptionBadgeNumber:        true,

				Messages: []*notification.SendCampaignNotificationRequest_Message{},
			},

			dbExpect: func(store *mocks.MockNotificationSettingsStore, pub *mocks.MockPublisher) {
				store.EXPECT().OneById(gomock.Any(), int32(1)).Return(nil, scylla.ErrNotFound)
				store.EXPECT().Create(gomock.Any(), scylla.NotificationSettings{
					CampaignId:                  1,
					AccountID:                   1,
					ExperienceId:                "1h3sk21vjxdghd73b",
					AttachmentUrl:               "https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
					AttachmentType:              scylla.AttachmentType_IMAGE,
					TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
					TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
					TapBehaviorUrl:              "",
					IosContentAvailable:         false,
					IosMutableContent:           true,
					IosSound:                    "sound.wav",
					IosCategoryIdentifier:       "ios-category",
					IosThreadIdentifier:         "ios-thread",
					AndroidChannelId:            "android-channel",
					AndroidSound:                "sound.wav",
					AndroidTag:                  "mytag",
					Expiration:                  -1,
					Attributes: map[string]string{
						"value1": "hello",
						"value2": "nope",
					},
					AlertOptionPushNotification:   true,
					AlertOptionNotificationCenter: true,
					AlertOptionBadgeNumber:        true,
				}).Return(nil)

				pub.EXPECT().Publish(gomock.Any(), gomock.Any()).Return(make([]error, 0))
			},

			exp: &notification.SendCampaignNotificationResponse{
				Results: []*notification.SendCampaignNotificationResponse_Result{},
			},
		},

		{
			name: "skips saving notification settings since it exists",
			req: &notification.SendCampaignNotificationRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				CampaignId:   1,
				ExperienceId: "1h3sk21vjxdghd73b",

				NotificationAttachmentUrl:   "https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
				NotificationAttachmentType:  notification.NotificationAttachmentType_IMAGE,
				NotificationTapBehaviorType: notification.NotificationTapBehaviorType_OPEN_EXPERIENCE,

				NotificationIosContentAvailable:   false,
				NotificationIosMutableContent:     true,
				NotificationIosCategoryIdentifier: "ios-category",
				NotificationIosSound:              "sound.wav",
				NotificationIosThreadIdentifier:   "ios-thread",

				NotificationAndroidChannelId: "android-channel",
				NotificationAndroidTag:       "mytag",
				NotificationAndroidSound:     "sound.wav",

				NotificationExpiration: -1,
				NotificationAttributes: map[string]string{
					"value1": "hello",
					"value2": "nope",
				},

				NotificationAlertOptionPushNotification:   true,
				NotificationAlertOptionNotificationCenter: true,
				NotificationAlertOptionBadgeNumber:        true,

				Messages: []*notification.SendCampaignNotificationRequest_Message{},
			},

			dbExpect: func(store *mocks.MockNotificationSettingsStore, pub *mocks.MockPublisher) {
				store.EXPECT().OneById(gomock.Any(), int32(1)).Return(&scylla.NotificationSettings{
					CampaignId:                  1,
					AccountID:                   1,
					ExperienceId:                "1h3sk21vjxdghd73b",
					AttachmentUrl:               "https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
					AttachmentType:              scylla.AttachmentType_IMAGE,
					TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
					TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
					TapBehaviorUrl:              "",
					IosContentAvailable:         false,
					IosMutableContent:           true,
					IosSound:                    "sound.wav",
					IosCategoryIdentifier:       "ios-category",
					IosThreadIdentifier:         "ios-thread",
					AndroidChannelId:            "android-channel",
					AndroidSound:                "sound.wav",
					AndroidTag:                  "mytag",
					Expiration:                  -1,
					Attributes: map[string]string{
						"value1": "hello",
						"value2": "nope",
					},
					AlertOptionPushNotification:   true,
					AlertOptionNotificationCenter: true,
					AlertOptionBadgeNumber:        true,
				}, nil)

				store.EXPECT().Create(gomock.Any(), gomock.Any()).Times(0)
				pub.EXPECT().Publish(gomock.Any(), gomock.Any()).Return(make([]error, 0))
			},

			exp: &notification.SendCampaignNotificationResponse{
				Results: []*notification.SendCampaignNotificationResponse_Result{},
			},
		},

		{
			name: "returns invalid argument when settings are invalid",
			req: &notification.SendCampaignNotificationRequest{
				CampaignId: 22,
			},

			dbExpect: func(store *mocks.MockNotificationSettingsStore, pub *mocks.MockPublisher) {
				store.EXPECT().OneById(gomock.Any(), int32(22)).Return(nil, scylla.ErrNotFound)
				store.EXPECT().Create(gomock.Any(), gomock.Any()).Return(scylla.NewValidationError("Validation Error"))
			},

			exp:      nil,
			expError: status.Error(codes.InvalidArgument, "Validation Error"),
		},

		{
			name: "serializes pubsub messages",
			req: &notification.SendCampaignNotificationRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  33,
				Messages: []*notification.SendCampaignNotificationRequest_Message{
					{
						NotificationTitle:          "title",
						NotificationBody:           "body",
						DeviceId:                   "abc123",
						DevicePushToken:            "token",
						DevicePushTokenEnvironment: notification.PushEnvironment_PRODUCTION,
						DeviceAppNamespace:         "io.rover.Bagel",
						DeviceBadgeCount:           2,
						OsName:                     "iOS",
						SdkVersion:                 &rover_protobuf.Version{1, 2, 3},
					},
				},
			},

			dbExpect: func(store *mocks.MockNotificationSettingsStore, pub *mocks.MockPublisher) {
				store.EXPECT().OneById(gomock.Any(), int32(33)).Return(&scylla.NotificationSettings{
					CampaignId:                  33,
					AccountID:                   1,
					ExperienceId:                "1h3sk21vjxdghd73b",
					AttachmentUrl:               "https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
					AttachmentType:              scylla.AttachmentType_IMAGE,
					TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
					TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
					TapBehaviorUrl:              "",
					IosContentAvailable:         false,
					IosMutableContent:           true,
					IosSound:                    "sound.wav",
					IosCategoryIdentifier:       "ios-category",
					IosThreadIdentifier:         "ios-thread",
					AndroidChannelId:            "android-channel",
					AndroidSound:                "sound.wav",
					AndroidTag:                  "mytag",
					Expiration:                  -1,
					Attributes: map[string]string{
						"value1": "hello",
						"value2": "nope",
					},
					AlertOptionPushNotification:   true,
					AlertOptionNotificationCenter: true,
					AlertOptionBadgeNumber:        true,
				}, nil)

				store.EXPECT().Create(gomock.Any(), gomock.Any()).Times(0)

				// The input should be an array but Go does not convert variable length arguments of size 1 to an
				// array
				pub.EXPECT().Publish(gomock.Any(), &DiffMatcher{Want: []pubsub.Message{
					&pubsub.PushMessage{
						Device: pubsub.Device{
							AccountID:            1,
							ID:                   "abc123",
							PushToken:            "token",
							PushTokenEnvironment: "PRODUCTION",
							AppNamespace:         "io.rover.Bagel",
							BadgeCount:           2,
							OsName:               "iOS",
							SdkVersion:           pubsub.Version{1, 2, 3},
						},
						CampaignID:        33,
						NotificationTitle: "title",
						NotificationBody:  "body",
					},
				}}).Return([]error{nil})
			},

			exp: &notification.SendCampaignNotificationResponse{
				Results: []*notification.SendCampaignNotificationResponse_Result{
					{
						Error: false,
					},
				},
			},
		},

		{
			name: "returns failures in response preserving message ids",
			req: &notification.SendCampaignNotificationRequest{
				CampaignId: 33,
				Messages: []*notification.SendCampaignNotificationRequest_Message{
					{
						DeviceId: "abc",
					},
					{
						DeviceId: "boom",
					},
					{
						DeviceId: "123",
					},
				},
			},

			dbExpect: func(store *mocks.MockNotificationSettingsStore, pub *mocks.MockPublisher) {
				store.EXPECT().OneById(gomock.Any(), int32(33)).Return(&scylla.NotificationSettings{
					CampaignId:                  33,
					AccountID:                   1,
					ExperienceId:                "1h3sk21vjxdghd73b",
					AttachmentUrl:               "https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
					AttachmentType:              scylla.AttachmentType_IMAGE,
					TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
					TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
					TapBehaviorUrl:              "",
					IosContentAvailable:         false,
					IosMutableContent:           true,
					IosSound:                    "sound.wav",
					IosCategoryIdentifier:       "ios-category",
					IosThreadIdentifier:         "ios-thread",
					AndroidChannelId:            "android-channel",
					AndroidSound:                "sound.wav",
					AndroidTag:                  "mytag",
					Expiration:                  -1,
					Attributes: map[string]string{
						"value1": "hello",
						"value2": "nope",
					},
					AlertOptionPushNotification:   true,
					AlertOptionNotificationCenter: true,
					AlertOptionBadgeNumber:        true,
				}, nil)

				store.EXPECT().Create(gomock.Any(), gomock.Any()).Times(0)
				pub.EXPECT().Publish(gomock.Any(), gomock.Any()).Return([]error{nil, errors.New("Failed"), nil})
			},

			exp: &notification.SendCampaignNotificationResponse{
				Results: []*notification.SendCampaignNotificationResponse_Result{
					{
						Error: false,
					},
					{
						Error:   true,
						Message: "Failed",
					},
					{
						Error: false,
					},
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl   = gomock.NewController(t)
				store  = mocks.NewMockNotificationSettingsStore(ctrl)
				pub    = mocks.NewMockPublisher(ctrl)
				server = grpc.NotificationServer{
					DB: &DB{
						store: store,
					},
					Publisher: pub,
				}
			)
			defer ctrl.Finish()

			if test.dbExpect != nil {
				test.dbExpect(store, pub)
			}

			var (
				exp, expErr = test.exp, test.expError
				got, gotErr = server.SendCampaignNotification(context.Background(), test.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}

		})
	}
}
