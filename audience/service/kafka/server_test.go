// +build integration

package kafka_test

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"testing"
	"time"

	"github.com/namsral/flag"

	"github.com/roverplatform/rover/audience/service/kafka"
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
		testTopic = fmt.Sprintf("test-topic_%d", rand.Int())

		consumed = make(chan struct{})

		exp = "hello world"
		got []byte

		handlers = map[string]kafka.Handler{
			testTopic: kafka.HandlerFunc(func(ctx context.Context, msg *kafka.Message) {
				got = msg.Value
				select {
				case <-consumed:
				default:
					close(consumed)
				}
			}),
		}
	)

	config, err := kafka.ParseDSN(*kafkaDsn, kafka.DefaultConfig())
	if err != nil {
		t.Fatal(err)
	}

	config["group.id"] = "server-test"
	if debug := os.Getenv("KAFKA_DEBUG"); testing.Verbose() && debug != "" {
		config["debug"] = "all"
	}

	server, err := kafka.NewServer(&config, handlers)
	if err != nil {
		t.Fatal(err)
	}

	defer server.Stop(nil)

	go func() {
		if err := server.Run(); err != nil {
			t.Fatal(err)
		}
	}()

	time.Sleep(1 * time.Second)

	producer, err := kafka.NewProducer(&config)
	if err != nil {
		t.Fatal(err)
	}

	var delivered = make(chan kafka.Event, 1)

	producer.Produce(
		&kafka.Message{
			TopicPartition: kafka.TopicPartition{Topic: &testTopic},
			Value:          []byte("hello world"),
		},
		delivered,
	)
	producer.Flush(500)

	switch msg := (<-delivered).(type) {
	case *kafka.Message:
		if err := msg.TopicPartition.Error; err != nil {
			t.Fatal("error:", err)
		}
	default:
		t.Fatal(msg)
	}

	select {
	case <-consumed:
		// t.Log("Consumed:", string(got))
	case <-time.After(5 * time.Second):
		t.Fatal("Timeout")
	}

	if string(got) != exp {
		t.Fatalf("\ngot:%q\nexp:%q", string(got), string(exp))
	}
}
