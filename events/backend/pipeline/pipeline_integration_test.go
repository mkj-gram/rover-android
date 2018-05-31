package pipeline_test

import (
	"context"
	"flag"
	"testing"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"

	"github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/events/backend/pipeline"

	rtesting "github.com/roverplatform/rover/go/testing"
)

var (
	tKafkaDsn        = flag.String("kafka-test-dsn", "kafka", "test kafka server")
	tTestTopicInput  = flag.String("kafka-topic-input", "test-pipeline-topic-input", "The topic to use for tests")
	tTestTopicOutput = flag.String("kafka-topic-output", "test-pipeline-topic-output", "The topic to use for tests")
)

func TestPipeline(t *testing.T) {

	var (
		consumer = createConsumer("source", t)
		producer = createProducer("sink", t)

		writer = createProducer("producer", t)
		reader = createConsumer("consumer", t)

		req = &event.Event{
			AuthContext: &auth.AuthContext{AccountId: 1, PermissionScopes: []string{"server"}},
			Namespace:   "rover",
			Id:          "123ABC",
			Name:        "My Event",
		}

		// Track the event that the pipeline was trying to transform
		handledEvent *event.Event
	)

	// Dumb handler which just forwards the event
	handler := pipeline.HandlerFunc(func(ctx pipeline.Context, e *event.Event) error {
		handledEvent = e
		return nil
	})

	// Start the pipeline
	p := pipeline.NewPipeline(consumer, *tTestTopicInput, producer, *tTestTopicOutput, handler)
	go func() {
		if err := p.Run(context.Background()); err != nil {
			t.Fatal(err)
		}
	}()

	// Add event to kafka topic for pipeline to pick up
	err := produceEvent(writer, *tTestTopicInput, req)
	if err != nil {
		t.Fatal(err)
	}

	// Subscribe to the output topic and wait for the next event
	reader.Subscribe(*tTestTopicOutput, nil)
	output, err := consumeEvent(reader, 10*time.Second)
	if err != nil {
		t.Fatal(err)
	}

	// Shutdown and clean up the pipeline. If an error is thrown during shutdown the test fails
	p.Shutdown(1 * time.Second)

	if handledEvent == nil {
		t.Error("Handler was not called")
	}

	if diff := rtesting.Diff(req, output, nil, nil); diff != nil {
		t.Errorf("Diff:\n%v", rtesting.Difff(diff))
	}
}

// Test when an error is returned back to the pipeline which is not of type pipeline.Error
// The expected behaviour here is that the pipeline swallows the error and moves on
// It should commit the message as the offset
func TestPipeline_WithGenericError(t *testing.T) {
	t.Skip("TODO")
}

// Test when a handler returns a pipeline.Error with retryable set to true
// The expected behaviour is that the handler is re-called depending on the retry parameters
// Once the backoff and retry has been exhausted the pipeline shutdown
func TestPipeline_WithRetryableError(t *testing.T) {
	t.Skip("TODO")
}

/*
	Helper Methods
*/

// Helper method to create a unique kafka consumer
func createConsumer(id string, t *testing.T) *kafka.Consumer {

	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"group.id":           id,
		"bootstrap.servers":  *tKafkaDsn,
		"session.timeout.ms": 6000,
		"auto.offset.reset":  "earliest",
		"enable.auto.commit": false,
	})

	if err != nil {
		t.Fatal(err)
	}

	return consumer
}

// Helper method to create a unique kafka producer
func createProducer(id string, t *testing.T) *kafka.Producer {
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"group.id":           id,
		"bootstrap.servers":  *tKafkaDsn,
		"session.timeout.ms": 6000,
		"auto.offset.reset":  "latest",
		"enable.auto.commit": false,
	})

	if err != nil {
		t.Fatal(err)
	}

	return producer
}

// Helper method to synchronously produce an event to a kafka topic
func produceEvent(producer *kafka.Producer, topic string, e *event.Event) error {
	data, err := proto.Marshal(e)
	if err != nil {
		return nil
	}

	var (
		done = make(chan kafka.Event)

		msg = &kafka.Message{
			TopicPartition: kafka.TopicPartition{
				Topic: &topic,
			},
			Value: data,
		}
	)

	producer.Produce(msg, done)
	ret := <-done

	switch m := ret.(type) {
	case *kafka.Message:
		if m.TopicPartition.Error != nil {
			return m.TopicPartition.Error
		}
		return nil
	case kafka.Error:
		return m
	default:
		return errors.Errorf("Unknown kafka event: %v", m)
	}
}

// Helper to consume the next kafka message before a timeout occurs
func consumeEvent(consumer *kafka.Consumer, timeout time.Duration) (*event.Event, error) {

	timer := time.After(timeout)

	for {
		select {
		case <-timer:
			return nil, errors.New("Timeout")
		default:
			ev := consumer.Poll(100)
			if ev == nil {
				continue
			}

			switch msg := ev.(type) {
			case *kafka.Message:
				var e event.Event
				err := proto.Unmarshal(msg.Value, &e)
				if err != nil {
					return nil, err
				}
				return &e, nil
			case kafka.PartitionEOF:
				continue
			case kafka.Error:
				return nil, msg
			default:
				return nil, errors.Errorf("Unknown message from kafka: %v", msg)
			}
		}
	}
}
