package pipeline

import (
	"errors"
	"testing"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"

	"github.com/golang/protobuf/proto"
	"github.com/roverplatform/rover/apis/go/event/v1"

	"github.com/roverplatform/rover/events/backend/pipeline/mocks"
	rtesting "github.com/roverplatform/rover/go/testing"
)

var quickBackoff = &Backoff{MaxAttempts: 5, Min: 1 * time.Millisecond, Max: 1 * time.Millisecond, Factor: 1}

// Inject our time function the pipeline will use
var now = func() time.Time {
	t, _ := time.Parse(time.RFC3339, "2006-01-02T15:04:05Z")
	return t
}

// Default handler which just accepts an event and passes it along
var defaultHandler = HandlerFunc(func(ctx Context, e *event.Event) error {
	return nil
})

func TestPipeline_handle_produces_and_commits_on_success(t *testing.T) {
	t.Parallel()

	var (
		topic    = "test"
		producer = mocks.Producer{}
		consumer = mocks.Consumer{}

		req = &kafka.Message{Value: serialize(t, &event.Event{Id: "id", Name: "name"}), Key: []byte("key")}
		exp = &kafka.Message{
			Key:            []byte("key"),
			TopicPartition: kafka.TopicPartition{Topic: &topic},
			Timestamp:      now(),
			Value: serialize(t, &event.Event{
				Id:   "id",
				Name: "name",
			}),
		}

		pipe = NewPipeline(&consumer, topic, &producer, topic, defaultHandler, WithTimeFunc(now))
	)

	pipe.handle(req)

	if len(consumer.CommittedMessages) != 1 {
		t.Fatal("Message was not commited")
	}

	commited := consumer.CommittedMessages[0]
	if diff := rtesting.Diff(req, commited, nil, nil); diff != nil {
		t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
	}

	if len(producer.ProducedMessages) != 1 {
		t.Fatal("Message was not produced")
	}

	produced := producer.ProducedMessages[0]

	if diff := rtesting.Diff(exp, produced, nil, nil); diff != nil {
		t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
	}
}

// When the pipeline encounters an error which is not a retryable error it should
// skip over the message by commits and not producing the message
func TestPipeline_handle_only_commits_on_error(t *testing.T) {
	t.Parallel()

	var (
		topic    = "test"
		producer = mocks.Producer{}
		consumer = mocks.Consumer{}

		req = &kafka.Message{Value: serialize(t, &event.Event{Id: "id", Name: "name"}), Key: []byte("key")}

		errorHandler = HandlerFunc(func(ctx Context, e *event.Event) error {
			return errors.New("we can not continue")
		})

		pipe = NewPipeline(&consumer, topic, &producer, topic, errorHandler)
	)

	pipe.handle(req)

	if len(consumer.CommittedMessages) != 1 {
		t.Fatal("Message was not commited")
	}

	commited := consumer.CommittedMessages[0]
	if diff := rtesting.Diff(req, commited, nil, nil); diff != nil {
		t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
	}

	if len(producer.ProducedMessages) != 0 {
		t.Fatal("No messages should have been produced")
	}
}

// Test that handle retries errors which are retryable
func TestPipeline_handle_retries_on_error(t *testing.T) {
	t.Parallel()

	var (
		producer = mocks.Producer{}
		consumer = mocks.Consumer{}

		req = &kafka.Message{Value: serialize(t, &event.Event{Id: "id", Name: "name"}), Key: []byte("key")}

		handlerCalled = 0
		countHandler  = HandlerFunc(func(ctx Context, e *event.Event) error {
			handlerCalled++
			if handlerCalled < 3 {
				return NewRetryableError(nil)
			}

			return nil
		})

		pipe = NewPipeline(&consumer, "test", &producer, "test", countHandler, WithBackoff(quickBackoff))
	)

	pipe.handle(req)

	if handlerCalled != 3 {
		t.Fatalf("Expecting handler to be called 3 times but was only called: %d", handlerCalled)
	}

	if len(consumer.CommittedMessages) <= 0 {
		t.Fatal("Message was not commited")
	}

	committed := consumer.CommittedMessages[0]
	if diff := rtesting.Diff(req, committed, nil, nil); diff != nil {
		t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
	}

}

// After too many attempts at a retryable error the pipeline panics
func TestPipeline_handle_panics_after_too_many_attempts(t *testing.T) {
	t.Parallel()

	var (
		producer = mocks.Producer{}
		consumer = mocks.Consumer{}

		req = &kafka.Message{Value: serialize(t, &event.Event{Id: "id", Name: "name"}), Key: []byte("key")}

		countHandler = HandlerFunc(func(ctx Context, e *event.Event) error {
			return NewRetryableError(nil)
		})

		pipe = NewPipeline(&consumer, "test", &producer, "test", countHandler, WithBackoff(quickBackoff))
	)

	defer func() {
		if r := recover(); r == nil {
			t.Fatal("expecting panic but got nothing")
		}
	}()

	pipe.handle(req)

}

func TestPipeline_process(t *testing.T) {
	t.Parallel()

	var (
		topic = "hello"
	)

	tests := []struct {
		desc    string
		in      *kafka.Message
		handler HandlerFunc

		exp    *kafka.Message
		expErr error
	}{
		{
			desc: "returns error when input is invalid protobuf",
			in:   &kafka.Message{Value: []byte("e"), Key: []byte("a")},

			expErr: errors.New("proto.Unmarshal: unexpected EOF"),
		},
		{
			desc: "returns error when input is an invalid event",
			in:   &kafka.Message{Value: serialize(t, &event.Event{}), Key: []byte("a")},

			expErr: errors.New("validation error: id is missing"),
		},
		{
			desc: "embeds EventInput in Event",
			in: &kafka.Message{
				Key: []byte("a"),
				Value: serialize(t, &event.Event{
					Id:   "ABC",
					Name: "MyEvent",
				})},

			exp: &kafka.Message{
				TopicPartition: kafka.TopicPartition{Topic: &topic},
				Key:            []byte("a"),
				Timestamp:      now(),
				Value: serialize(t, &event.Event{

					Id:   "ABC",
					Name: "MyEvent",
				}),
			},
		},
		{
			desc: "recovers from panics",
			in:   &kafka.Message{Value: serialize(t, &event.Event{Id: "A", Name: "test"}), Key: []byte("a")},

			handler: HandlerFunc(func(ctx Context, e *event.Event) error {
				panic("Boom")
				return nil
			}),

			expErr: errors.New("failed to process event: Boom"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.desc, func(t *testing.T) {

			var handler = tt.handler
			if tt.handler == nil {
				handler = defaultHandler
			}

			pipe := NewPipeline(nil, topic, nil, topic, handler, WithTimeFunc(now))

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = pipe.process(tt.in)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}
		})
	}
}

func TestPipeline_complete(t *testing.T) {
	t.Skip("TODO")
}

func serialize(t *testing.T, pb proto.Message) []byte {
	val, err := proto.Marshal(pb)
	if err != nil {
		t.Errorf("Failed to marshal protobuf: %v", err)
	}

	return val
}
