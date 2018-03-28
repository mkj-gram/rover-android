package mocks

import (
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Consumer struct {
	Messages          []*kafka.Message
	CommittedMessages []*kafka.Message

	subscribedTo []string
	offset       int
}

func (c *Consumer) Subscribe(topic string, rb kafka.RebalanceCb) error {
	c.subscribedTo = append(c.subscribedTo, topic)
	return nil
}

func (*Consumer) Close() error {
	return nil
}

func (c *Consumer) Poll(timeout int) kafka.Event {
	if c.offset > len(c.Messages) {
		return kafka.PartitionEOF{}
	}

	var next = c.Messages[c.offset]
	c.offset++

	return next
}

func (c *Consumer) CommitMessage(msg *kafka.Message) ([]kafka.TopicPartition, error) {

	c.CommittedMessages = append(c.CommittedMessages, msg)

	return []kafka.TopicPartition{
		{
			Topic:     msg.TopicPartition.Topic,
			Partition: 0,
			Offset:    msg.TopicPartition.Offset,
		},
	}, nil
}
