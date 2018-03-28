package mocks

import (
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type Producer struct {
	ProducedMessages []*kafka.Message
}

func (p *Producer) Close() {}

func (p *Producer) Produce(msg *kafka.Message, d chan kafka.Event) error {
	// we immediatly say that the message has been produced
	p.ProducedMessages = append(p.ProducedMessages, msg)

	// generate fake offset
	msg.TopicPartition.Offset = kafka.Offset(len(p.ProducedMessages) - 1)
	d <- msg

	return nil
}
