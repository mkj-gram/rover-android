package collector_test

import (
	"testing"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/mock/gomock"
	"github.com/golang/protobuf/proto"
	"github.com/roverplatform/rover/analytics/backend/collector"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/analytics/backend/usecase/mocks"
	notification "github.com/roverplatform/rover/apis/go/notification/v1/events"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func serialize(t *testing.T, event *notification.Event) []byte {
	out, err := proto.Marshal(event)
	if err != nil {
		t.Fatal(err)
	}
	return out
}

func TestNotificationEventsHandler_Handle(t *testing.T) {
	//var (
	//	now = time.Date(2018, 6, 22, 8, 33, 23, 0, time.UTC)
	//	nowProto, _ = timestamp.TimestampProto(now)
	//)

	var tests = []struct {
		name string

		msg      *kafka.Message
		storeExp func(s *mocks.MockNotificationSentStore)
		expErr   error
	}{
		{
			name: "skips over invalid protobuf data",
			msg: &kafka.Message{
				Value: []byte("hi"),
			},
			storeExp: func(s *mocks.MockNotificationSentStore) {
				s.EXPECT().Create(gomock.Any()).Times(0)
			},
			expErr: nil,
		},
		// TODO figure out why gomock does not match variadic function arguments correctly
		//{
		//	name: "handles notification sent event",
		//	msg: &kafka.Message{
		//		Value: serialize(t, &notification.Event{
		//			Type: &notification.Event_PushNotificationSent{
		//				PushNotificationSent: &notification.PushNotificationSent{
		//					Timestamp:  nowProto,
		//					AccountId:  1,
		//					CampaignId: 1,
		//					DeviceId:   "my-device",
		//					Result:     notification.PushNotificationSent_DELIVERED,
		//				},
		//			},
		//		}),
		//	},
		//	storeExp: func(s *mocks.MockNotificationSentStore) {
		//		s.EXPECT().Create([]interface{}{
		//			&domain.NotificationSentRecord{
		//				Timestamp:  now,
		//				AccountID:  1,
		//				CampaignID: 1,
		//				Channel:    domain.NotificationSentChannel_PUSH,
		//				Result:     domain.NotificationSentResult_DELIVERED,
		//				DeviceID:   "my-device",
		//			},
		//		}).Return(nil)
		//	},
		//	expErr: nil,
		//},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl    = gomock.NewController(t)
				store   = mocks.NewMockNotificationSentStore(ctrl)
				handler = collector.NotificationEventsHandler{
					Interactor: usecase.NotificationsInteractor{
						SentStore: store,
					},
				}
			)
			defer ctrl.Finish()
			if test.storeExp != nil {
				test.storeExp(store)
			}

			var gotErr = handler.Handle(test.msg)
			if diff := rtesting.Diff(nil, nil, test.expErr, gotErr); diff != nil {
				t.Fatalf("\n%s", rtesting.Difff(diff))
			}
		})
	}

}
