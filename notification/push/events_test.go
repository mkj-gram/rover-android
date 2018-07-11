package push_test

import (
	"context"
	"testing"
	"time"

	"github.com/appleboy/go-fcm"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"
	"github.com/sideshow/apns2"

	"github.com/roverplatform/rover/apis/go/notification/v1/events"
	"github.com/roverplatform/rover/apis/go/protobuf/wrappers"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"
	"github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/push"
	"github.com/roverplatform/rover/notification/push/mocks"
	"github.com/roverplatform/rover/notification/scylla"
)

func TestWithEventTracking(t *testing.T) {
	var topic = "notification.events"

	var now = func() time.Time {
		return time.Date(2018, 6, 10, 6, 33, 0, 0, time.UTC)
	}
	push.TimeFunc = now
	defer func() {
		push.TimeFunc = func() time.Time { return time.Now() }
	}()

	var nowProto, err = timestamp.TimestampProto(now())
	if err != nil {
		t.Fatal(err)
	}

	var defaultMessage = &pubsub.PushMessage{
		Device: pubsub.Device{
			ID:             "hello123",
			AccountID:      1,
			PushToken:      "token",
			AppBadgeNumber: intPtr(12),
		},
		CampaignID: 33,
		IsTest:     false,
	}

	var tests = []struct {
		name     string
		message  pubsub.Message
		response *push.Response

		exp []*kafka.Message
	}{
		{
			name:     "produces nothing upon nil response",
			response: nil,
			exp:      nil,
		},
		{
			name: "produces nothing upon test message",
			message: &pubsub.PushMessage{
				IsTest: true,
			},
			response: &push.Response{
				NotificationSettings: &scylla.NotificationSettings{
					AlertOptionNotificationCenter: true,
					AlertOptionPushNotification:   false,
				},
				Notification: &scylla.Notification{
					IsTest: true,
				},
			},
			exp: nil,
		},
		{
			name:    "produces notification added to notification center",
			message: defaultMessage,
			response: &push.Response{
				NotificationSettings: &scylla.NotificationSettings{
					AlertOptionNotificationCenter: true,
					AlertOptionPushNotification:   false,
				},
				Notification: &scylla.Notification{},
			},

			exp: []*kafka.Message{
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_NotificationAddedToNotificationCenter{
							NotificationAddedToNotificationCenter: &events.NotificationAddedToNotificationCenter{
								Timestamp:  nowProto,
								AccountId:  1,
								CampaignId: 33,
								DeviceId:   "hello123",
							},
						},
					}),
				},
			},
		},
		{
			name:    "produces notification sent when apns returns 200",
			message: defaultMessage,
			response: &push.Response{
				NotificationSettings: &scylla.NotificationSettings{
					AlertOptionNotificationCenter: false,
					AlertOptionPushNotification:   true,
					AlertOptionBadgeNumber:        true,
				},
				Notification: &scylla.Notification{},
				APNS: struct {
					Request  interface{}
					Response interface{}
				}{
					Request: push.ToAPNSRequest(defaultMessage, &scylla.NotificationSettings{
						AlertOptionNotificationCenter: false,
						AlertOptionPushNotification:   true,
						AlertOptionBadgeNumber:        true,
					}, &scylla.Notification{}),
					Response: &apns2.Response{
						StatusCode: 200,
					},
				},
			},

			exp: []*kafka.Message{
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_PushNotificationSent{
							PushNotificationSent: &events.PushNotificationSent{
								Timestamp:   nowProto,
								AccountId:   1,
								CampaignId:  33,
								DeviceId:    "hello123",
								Result:      events.PushNotificationSent_DELIVERED,
								BadgeNumber: &wrappers.Int32Value{Value: 13},
							},
						},
					}),
				},
			},
		},
		{
			name:    "produces notification sent when fcm returns 200",
			message: defaultMessage,
			response: &push.Response{
				NotificationSettings: &scylla.NotificationSettings{
					AlertOptionNotificationCenter: false,
					AlertOptionPushNotification:   true,
				},
				Notification: &scylla.Notification{},
				FCM: struct {
					Request  interface{}
					Response interface{}
				}{Request: "hi", Response: &fcm.Response{Success: 1}},
			},

			exp: []*kafka.Message{
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_PushNotificationSent{
							PushNotificationSent: &events.PushNotificationSent{
								Timestamp:   nowProto,
								AccountId:   1,
								CampaignId:  33,
								DeviceId:    "hello123",
								Result:      events.PushNotificationSent_DELIVERED,
								BadgeNumber: nil,
							},
						},
					}),
				},
			},
		},

		{
			name:    "produces token unregistered when apns returns 410",
			message: defaultMessage,
			response: &push.Response{
				NotificationSettings: &scylla.NotificationSettings{
					AlertOptionNotificationCenter: false,
					AlertOptionPushNotification:   true,
				},
				Notification: &scylla.Notification{},
				APNS: struct {
					Request  interface{}
					Response interface{}
				}{
					Request: "hi",
					Response: &apns2.Response{
						StatusCode: 410,
						Timestamp:  apns2.Time{Time: now()},
					},
				},
			},

			exp: []*kafka.Message{
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_PushNotificationSent{
							PushNotificationSent: &events.PushNotificationSent{
								Timestamp:  nowProto,
								AccountId:  1,
								CampaignId: 33,
								DeviceId:   "hello123",
								Result:     events.PushNotificationSent_UNREACHABLE,
							},
						},
					}),
				},
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_PushTokenUnregistered{
							PushTokenUnregistered: &events.PushTokenUnregistered{
								UnregisteredAt: nowProto,
								AccountId:      1,
								DeviceId:       "hello123",
								PushToken:      "token",
							},
						},
					}),
				},
			},
		},

		{
			name:    "produces token unregistered when fcm returns Unregistered",
			message: defaultMessage,
			response: &push.Response{
				NotificationSettings: &scylla.NotificationSettings{
					AlertOptionNotificationCenter: false,
					AlertOptionPushNotification:   true,
				},
				Notification: &scylla.Notification{},
				FCM: struct {
					Request  interface{}
					Response interface{}
				}{
					Request: &fcm.Message{},
					Response: &fcm.Response{
						Failure: 1,
						Results: []fcm.Result{
							{
								MessageID:      "message-id",
								RegistrationID: "my-new-token",
								Error:          fcm.ErrNotRegistered,
							},
						},
					},
				},
			},

			exp: []*kafka.Message{
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_PushNotificationSent{
							PushNotificationSent: &events.PushNotificationSent{
								Timestamp:  nowProto,
								AccountId:  1,
								CampaignId: 33,
								DeviceId:   "hello123",
								Result:     events.PushNotificationSent_UNREACHABLE,
							},
						},
					}),
				},
				{
					Timestamp: now(),
					TopicPartition: kafka.TopicPartition{
						Topic:     &topic,
						Partition: kafka.PartitionAny,
					},
					Value: serialize(t, &events.Event{
						Type: &events.Event_PushTokenUnregistered{
							PushTokenUnregistered: &events.PushTokenUnregistered{
								UnregisteredAt:   nowProto,
								AccountId:        1,
								DeviceId:         "hello123",
								PushToken:        "token",
								UpdatedPushToken: "my-new-token",
							},
						},
					}),
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				producer = &mock_push.MockProducer{}
				handler  = push.HandlerFunc(func(ctx context.Context, message pubsub.Message) (*push.Response, error) {
					return test.response, nil
				})
			)

			push.WithEventTracking(producer, nil, handler)(context.Background(), test.message)

			var got = producer.Produced
			if diff := rtesting.Diff(test.exp, got, nil, nil); diff != nil {
				t.Fatalf("\n%s", rtesting.Difff(diff))
			}
		})
	}
}

func serialize(t *testing.T, message proto.Message) []byte {
	t.Helper()
	out, err := proto.Marshal(message)
	if err != nil {
		t.Fatal(err)
	}
	return out
}
