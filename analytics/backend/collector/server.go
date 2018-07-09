package collector

import (
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/pkg/errors"
)

type Handler interface {
	Handle(msg *kafka.Message) error
}

type Server struct {
	consumer *kafka.Consumer
	handlers map[string]Handler

	shutdown, done chan struct{}
}

func NewServer(kafkaDsn string, handlers map[string]Handler) (*Server, error) {
	var consumer, err = kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers":       kafkaDsn,
		"group.id":                "analytics:collector", // Must be stable cannot edit
		"session.timeout.ms":      6000,
		"socket.keepalive.enable": true,
		"default.topic.config": kafka.ConfigMap{
			"compression.codec":  "snappy",
			"auto.offset.reset":  "earliest",
			"auto.commit.enable": true, // let kafka client auto commit offsets for us
		},
	})
	if err != nil {
		return nil, err
	}

	return &Server{
		consumer: consumer,
		handlers: handlers,
		shutdown: make(chan struct{}, 1),
		done:     make(chan struct{}, 1),
	}, nil
}

func (server *Server) Run() error {

	defer func() {
		server.done <- struct{}{}
	}()

	var topics []string
	for topic := range server.handlers {
		topics = append(topics, topic)
	}

	// NOTE: if we subscribe to a topic which doesn't exist librdkafka silently fails
	// polling will always return nil messages
	if err := server.consumer.SubscribeTopics(topics, nil); err != nil {
		return err
	}

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
		case *kafka.Message:
			if handler, ok := server.handlers[*msg.TopicPartition.Topic]; ok {
				if err := handler.Handle(msg); err != nil {
					return err
				}
			}
		case kafka.Error:
			return msg
		case kafka.PartitionEOF, kafka.AssignedPartitions, kafka.OffsetsCommitted:
			continue
		default:
			return errors.Errorf("unknown kafka event(%T): %v", msg, msg)
		}
	}

}

func (server *Server) Stop() {
	server.shutdown <- struct{}{}
	// wait for done signal
	<-server.done
	// Force commit back to kafka for the last message processed
	server.consumer.Commit()
	// Close the client and cleanup
	server.consumer.Close()
}
