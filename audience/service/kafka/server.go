package kafka

import (
	"context"

	"github.com/pkg/errors"
)

type Server struct {
	consumer *Consumer
	handlers map[string]Handler

	done, shutdown chan struct{}
}

func NewServer(config *ConfigMap, handlers map[string]Handler) (*Server, error) {
	var consumer, err = NewConsumer(config)
	if err != nil {
		return nil, err
	}

	return &Server{
		consumer: consumer,
		handlers: handlers,
		done:     make(chan struct{}),
		shutdown: make(chan struct{}),
	}, nil
}

func (server *Server) Run() error {
	defer func() {
		select {
		case <-server.done:
		default:
			close(server.done)
		}
	}()

	var (
		topics []string
	)
	for topic := range server.handlers {
		topics = append(topics, topic)
	}

	// NOTE: if we subscribe to a topic which doesn't exist librdkafka silently fails
	// polling will always return nil messages
	if err := server.consumer.SubscribeTopics(topics, nil); err != nil {
		return errors.Wrap(err, "SubscribeTopics")
	}

	var ctx, cancelFn = context.WithCancel(context.Background())

	// listen shutdown signal outside of workloop so it's not blocked by handler processing
	go func() {
		select {
		case <-server.shutdown:
			cancelFn()
		}
	}()

	for {
		select {
		case <-server.shutdown:
			return nil
		default:
		}

		var e = server.consumer.Poll(100)
		if e == nil {
			continue
		}

		switch msg := e.(type) {
		case *Message:
			handler, ok := server.handlers[*msg.TopicPartition.Topic]
			if !ok {
				// TODO: log?
				continue
			}

			handler.Handle(ctx, msg)

		case Error:
			return msg
		case PartitionEOF, AssignedPartitions, OffsetsCommitted:
			continue
		default:
			panic(errors.Errorf("unknown kafka event(%T): %v", msg, msg))
		}
	}
}

func (server *Server) Stop(ctx context.Context) error {
	if ctx == nil {
		ctx = context.TODO()
	}

	select {
	case <-server.shutdown:
		return nil
	default:
		close(server.shutdown)
	}

	// Force commit back to kafka for the last message processed
	server.consumer.Commit()
	// Close the client and cleanup
	server.consumer.Close()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-server.done:
	}

	return nil
}
