package notification_test

import (
	"context"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	audience_mocks "github.com/roverplatform/rover/apis/go/audience/v1/mock"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	notification_events "github.com/roverplatform/rover/apis/go/notification/v1/events"
	"github.com/roverplatform/rover/apis/go/protobuf/wrappers"
	"github.com/roverplatform/rover/audience/service/kafka"
	"github.com/roverplatform/rover/audience/service/notification"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func protoMarshal(t *testing.T, msg proto.Message) []byte {
	out, err := proto.Marshal(msg)
	if err != nil {
		t.Fatal(err)
	}
	return out
}

type (
	handlerResponse = notification.HandlerResponse

	Mocks struct {
		*audience_mocks.MockAudienceClient
	}

	given struct {
		*kafka.Message
		SetupMocks func(m Mocks)
	}

	expect struct {
		*notification.HandlerResponse
		error error
	}
)

func kafkaMessage(t *testing.T, evt *notification_events.PushNotificationSent) *kafka.Message {
	return &kafka.Message{
		Value: protoMarshal(t, &notification_events.Event{
			Type: &notification_events.Event_PushNotificationSent{
				PushNotificationSent: evt,
			},
		}),
	}
}

func TestEventsHandler(t *testing.T) {
	notification.MaxAttempts = 3

	var (
		authCtx = &auth.AuthContext{
			AccountId:        1,
			PermissionScopes: []string{"server", "audience"},
		}
		ctx = context.Background()
	)

	var tcases = []struct {
		desc string

		*given
		*expect
	}{
		{
			desc: "nothing: invalid input",
			given: &given{
				Message: nil,
			},
			expect: &expect{},
		},

		{
			desc: "updates badge",
			given: &given{
				Message: kafkaMessage(t, &notification_events.PushNotificationSent{
					AccountId:   1,
					BadgeNumber: wrappers.Int32(22),
					DeviceId:    "deviceId",
				}),

				SetupMocks: func(m Mocks) {
					m.MockAudienceClient.EXPECT().
						UpdateDeviceAppBadgeNumber(ctx,
							&audience.UpdateDeviceAppBadgeNumberRequest{
								AuthContext:    authCtx,
								AppBadgeNumber: wrappers.Int32(22),
								DeviceId:       "deviceId",
							},
						).
						Return(&audience.UpdateDeviceAppBadgeNumberResponse{}, nil)
				},
			},

			expect: &expect{
				HandlerResponse: &handlerResponse{
					Attempts: 1,
					Message: &notification_events.Event{
						Type: &notification_events.Event_PushNotificationSent{
							PushNotificationSent: &notification_events.PushNotificationSent{
								AccountId:   1,
								BadgeNumber: wrappers.Int32(22),
								DeviceId:    "deviceId",
							},
						},
					},
				},
			},
		},

		{
			desc: "error: badge update returns retriable error",
			given: &given{
				Message: kafkaMessage(t, &notification_events.PushNotificationSent{
					AccountId:   1,
					BadgeNumber: wrappers.Int32(22),
					DeviceId:    "deviceId",
				}),

				SetupMocks: func(m Mocks) {
					m.MockAudienceClient.EXPECT().
						UpdateDeviceAppBadgeNumber(ctx,
							&audience.UpdateDeviceAppBadgeNumberRequest{
								AuthContext:    authCtx,
								AppBadgeNumber: wrappers.Int32(22),
								DeviceId:       "deviceId",
							},
						).
						Times(3).
						Return(nil, status.Errorf(codes.Internal, "error"))
				},
			},

			expect: &expect{
				HandlerResponse: &handlerResponse{
					Attempts: 3,
					Message: &notification_events.Event{
						Type: &notification_events.Event_PushNotificationSent{
							PushNotificationSent: &notification_events.PushNotificationSent{
								AccountId:   1,
								BadgeNumber: wrappers.Int32(22),
								DeviceId:    "deviceId",
							},
						},
					},
				},
				error: errors.Wrap(status.Error(codes.Internal, "error"), "badger.UpdateDeviceAppBadgeNumber: backoff"),
			},
		},

		{
			desc: "error: badge update returns non-retriable error",
			given: &given{
				Message: kafkaMessage(t, &notification_events.PushNotificationSent{
					AccountId:   1,
					BadgeNumber: wrappers.Int32(22),
					DeviceId:    "deviceId",
				}),

				SetupMocks: func(m Mocks) {
					m.MockAudienceClient.EXPECT().
						UpdateDeviceAppBadgeNumber(ctx,
							&audience.UpdateDeviceAppBadgeNumberRequest{
								AuthContext:    authCtx,
								AppBadgeNumber: wrappers.Int32(22),
								DeviceId:       "deviceId",
							},
						).
						Times(1).
						Return(nil, status.Errorf(codes.PermissionDenied, "permission denied"))
				},
			},

			expect: &expect{
				HandlerResponse: &handlerResponse{
					Attempts: 1,
					Message: &notification_events.Event{
						Type: &notification_events.Event_PushNotificationSent{
							PushNotificationSent: &notification_events.PushNotificationSent{
								AccountId:   1,
								BadgeNumber: wrappers.Int32(22),
								DeviceId:    "deviceId",
							},
						},
					},
				},

				error: errors.Wrap(status.Error(codes.PermissionDenied, "permission denied"), "badger.UpdateDeviceAppBadgeNumber"),
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				ctrl = gomock.NewController(t)

				mocks = Mocks{
					MockAudienceClient: audience_mocks.NewMockAudienceClient(ctrl),
				}

				got = new(expect)
				exp = tc.expect

				handler = notification.EventsHandler{
					AudienceClient: mocks,
				}
			)

			defer ctrl.Finish()
			if tc.given != nil && tc.given.SetupMocks != nil {
				tc.given.SetupMocks(mocks)
			}

			got.HandlerResponse, got.error = handler.Handle(
				ctx, tc.given.Message,
			)

			if diff := rtesting.Diff(exp, got, nil, nil); diff != nil {
				t.Error("Response:\n", rtesting.Difff(diff))
			}
		})
	}
}
