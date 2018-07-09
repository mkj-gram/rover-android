package collector_test

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"testing"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/mock/gomock"
	"github.com/golang/protobuf/proto"
	"github.com/namsral/flag"

	"github.com/roverplatform/rover/analytics/backend/collector"
	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/analytics/backend/usecase/mocks"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	pipeline "github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/apis/go/protobuf/timestamp"
)

var (
	kafkaDsn = flag.String("test-kafka-dsn", "kafka:9092", "test kafka dsn")
)

func init() {
	flag.Parse()
	if *kafkaDsn == "" {
		flag.PrintDefaults()
		os.Exit(2)
	}
}

func TestServer_Run(t *testing.T) {

	rand.Seed(time.Now().UnixNano())

	// Generate a new topic for each test to ensure no other messages are present
	// Until the admin api comes out this is the easiest solution
	var (
		topic = fmt.Sprintf("test-topic_%d", rand.Int())
		ctrl  = gomock.NewController(t)
		store = mocks.NewMockNotificationOpenedStore(ctrl)
	)
	defer ctrl.Finish()

	t.Logf("Topic: %s", topic)
	// Expectations
	store.EXPECT().Create([]*domain.NotificationOpenedRecord{
		{
			Timestamp:  time.Unix(30, 0),
			AccountID:  1,
			CampaignID: 22,
			Source:     domain.NotificationOpenSource_PUSH,
			SubSource:  domain.NotificationOpenSubSource_DIRECT,
			DeviceID:   "hello",
		},
	})

	var handlers = map[string]collector.Handler{
		topic: &collector.PipelineEventsHandler{
			NotificationInteractor: usecase.NotificationsInteractor{
				OpenedStore: store,
			},
		},
	}

	server, err := collector.NewServer(*kafkaDsn, handlers)
	if err != nil {
		t.Fatal(err)
	}

	go server.Run()

	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers":     *kafkaDsn,
		"compression.codec":     "snappy",
		"session.timeout.ms":    6000,
		"request.required.acks": -1,
	})
	if err != nil {
		log.Fatal(err)
	}

	var event = &pipeline.Event{
		AuthContext: &auth.AuthContext{AccountId: 1},
		Namespace:   "rover",
		Name:        "Notification Opened",
		Timestamp:   &timestamp.Timestamp{Seconds: 30},
		Attributes: &structpb.Struct{Fields: map[string]*structpb.Value{
			"notificationID": structpb.String("abc"),
			"campaignID":     structpb.String("22"),
			"source":         structpb.String("pushNotification"),
		}},
		Device: &pipeline.DeviceContext{
			DeviceIdentifier: "hello",
		},
	}

	data, err := proto.Marshal(event)
	if err != nil {
		t.Fatal(err)
	}

	var wait = make(chan kafka.Event, 1)
	defer close(wait)

	producer.Produce(&kafka.Message{TopicPartition: kafka.TopicPartition{Topic: &topic}, Value: data}, wait)
	producer.Flush(500)

	var e kafka.Event
	select {
	case e = <-wait:
	case <-time.After(5 * time.Second):
		t.Fatal("Timeout")
	}

	switch msg := e.(type) {
	case *kafka.Message:
		if msg.TopicPartition.Error != nil {
			t.Fatal(err)
		}
	default:
		t.Fatal(msg)
	}

	time.Sleep(1 * time.Second)
	server.Stop()

}
