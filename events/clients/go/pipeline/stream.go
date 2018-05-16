package pipeline

import (
	"context"
	"sync"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/event/v1"
)

type StreamReceiver interface {
	Handle(data *event.Event) bool
}

type StreamReceiverFunc func(data *event.Event) bool

func (s StreamReceiverFunc) Handle(data *event.Event) bool {
	return s(data)
}

type StreamConsumer struct {
	source *kafka.Consumer
	config Config
	pool   sync.Pool
}

func NewStreamConsumer(source *kafka.Consumer, options ...Option) *StreamConsumer {

	var config = defaultConfig
	for _, option := range options {
		option(&config)
	}

	return &StreamConsumer{
		source: source,
		config: config,
		pool: sync.Pool{
			New: func() interface{} {
				return new(event.Event)
			},
		},
	}
}

func (stream *StreamConsumer) Receive(ctx context.Context, receiver StreamReceiver) error {
	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			msg, err := stream.readMessage(ctx, stream.config.ReadTimeout)
			if err != nil {
				return err
			}

			if msg == nil {
				continue
			}

			if err := stream.handle(ctx, msg, receiver); err != nil {
				return err
			}

			if err := stream.commit(ctx, msg); err != nil {
				return err
			}
		}
	}
}

func (stream *StreamConsumer) readMessage(ctx context.Context, timeout time.Duration) (*kafka.Message, error) {
	var (
		client    = stream.source
		timeoutMs = (int)(timeout.Seconds() * 1000)
	)

	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	default:
		ev := client.Poll(timeoutMs)

		switch e := ev.(type) {
		case *kafka.Message:
			if e.TopicPartition.Error != nil {
				return e, e.TopicPartition.Error
			}
			return e, nil
		case kafka.Error:
			return nil, e
		default:
			return nil, nil
		}
	}
}

func (stream *StreamConsumer) handle(ctx context.Context, message *kafka.Message, receiver StreamReceiver) error {
	var (
		data = message.Value
		ev   = stream.pool.Get().(*event.Event)
	)

	defer stream.pool.Put(ev)

	if err := proto.Unmarshal(data, ev); err != nil {
		// we can't decode the protobuf this means this message isn't an event
		// signal that we handled this message
		return err
	}

	var (
		attempt = 0
		backoff = stream.config.Retry
	)

	for attempt < backoff.MaxAttempts {
		acked := receiver.Handle(ev)
		if acked {
			break
		}

		select {
		case <-time.After(backoff.ForAttempt(attempt)):
			attempt++
		case <-ctx.Done():
			return ctx.Err()
		}
	}

	if attempt >= backoff.MaxAttempts {
		return errors.Errorf("max attempts reached for partition: %d, offset: %d", message.TopicPartition.Partition, message.TopicPartition.Offset)
	}

	return nil
}

// Commit the message back to kafka to signal we are done with the message
// Note this method is very taxing and should avoid using it in hot loops
func (stream *StreamConsumer) commit(ctx context.Context, message *kafka.Message) error {
	// TODO implement commit every to alleviate the network lag to commit
	var client = stream.source
	_, err := client.CommitMessage(message)
	return err
}
