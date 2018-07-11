package collector_test

import (
	"testing"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/mock/gomock"
	"github.com/golang/protobuf/proto"
	"github.com/roverplatform/rover/analytics/backend/collector"
	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/analytics/backend/usecase/mocks"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	pipeline "github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/apis/go/protobuf/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func ptr(i int) *int {
	return &i
}

func TestPipelineEventsHandler_Handle_ExperienceViewed(t *testing.T) {

	var (
		now      = time.Date(2018, 6, 22, 8, 33, 23, 0, time.UTC)
		nowProto = &timestamp.Timestamp{Seconds: now.Unix()}

		topic = "test"
	)

	var tests = []struct {
		name string
		msg  *kafka.Message

		storeExp func(s *mocks.MockExperienceViewedStore)
		expErr   error
	}{
		{
			name: "handles missing campaign id",
			msg: &kafka.Message{
				TopicPartition: kafka.TopicPartition{
					Topic:     &topic,
					Partition: 1,
					Offset:    40,
				},
				Key: []byte("DEVICE-10"),
				Value: serialize(t, &pipeline.Event{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Device: &pipeline.DeviceContext{
						DeviceIdentifier: "DEVICE-10",
					},
					Namespace: "rover",
					Name:      "Experience Viewed",
					Timestamp: nowProto,
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"experienceID": structpb.String("ABFD"),
							"duration":     structpb.Number(20.22),
						},
					},
				}),
			},

			storeExp: func(s *mocks.MockExperienceViewedStore) {
				s.EXPECT().Create(&domain.ExperienceViewedRecord{
					Timestamp:    now,
					AccountID:    1,
					CampaignID:   nil,
					ExperienceID: "ABFD",
					Duration:     20.22,
					DeviceID:     "DEVICE-10",
				}).Return(nil)
			},

			expErr: nil,
		},
		{
			name: "skips over when duration is missing",
			msg: &kafka.Message{
				TopicPartition: kafka.TopicPartition{
					Topic:     &topic,
					Partition: 1,
					Offset:    40,
				},
				Key: []byte("DEVICE-10"),
				Value: serialize(t, &pipeline.Event{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Device: &pipeline.DeviceContext{
						DeviceIdentifier: "DEVICE-10",
					},
					Namespace: "rover",
					Name:      "Experience Viewed",
					Timestamp: nowProto,
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"experienceID": structpb.String("ABFD"),
						},
					},
				}),
			},

			storeExp: func(s *mocks.MockExperienceViewedStore) {
				s.EXPECT().Create(gomock.Any()).Return(nil).Times(0)
			},

			expErr: nil,
		},
		{
			name: "handles experience viewed events",
			msg: &kafka.Message{
				TopicPartition: kafka.TopicPartition{
					Topic:     &topic,
					Partition: 1,
					Offset:    40,
				},
				Key: []byte("DEVICE-10"),
				Value: serialize(t, &pipeline.Event{
					AuthContext: &auth.AuthContext{AccountId: 1},
					Device: &pipeline.DeviceContext{
						DeviceIdentifier: "DEVICE-10",
					},
					Namespace: "rover",
					Name:      "Experience Viewed",
					Timestamp: nowProto,
					Attributes: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							"campaignID":   structpb.String("22"),
							"experienceID": structpb.String("ABFD"),
							"duration":     structpb.Number(20.22),
						},
					},
				}),
			},

			storeExp: func(s *mocks.MockExperienceViewedStore) {
				s.EXPECT().Create(&domain.ExperienceViewedRecord{
					Timestamp:    now,
					AccountID:    1,
					CampaignID:   ptr(22),
					ExperienceID: "ABFD",
					Duration:     20.22,
					DeviceID:     "DEVICE-10",
				}).Return(nil)
			},

			expErr: nil,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				ctrl    = gomock.NewController(t)
				store   = mocks.NewMockExperienceViewedStore(ctrl)
				handler = collector.PipelineEventsHandler{
					ExperienceInteractor: usecase.ExperienceInteractor{
						ViewedStore: store,
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

func serialize(t *testing.T, pb proto.Message) []byte {
	out, err := proto.Marshal(pb)
	if err != nil {
		t.Fatal(err)
	}
	return out
}
