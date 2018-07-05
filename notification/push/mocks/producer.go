package mock_push

import "github.com/confluentinc/confluent-kafka-go/kafka"

type MockProducer struct {
	Produced []*kafka.Message
}

func (producer *MockProducer) Produce(msg *kafka.Message, delivery chan kafka.Event) error {
	producer.Produced = append(producer.Produced, msg)
	delivery <- &kafka.Message{
		TopicPartition: kafka.TopicPartition{
			Topic:     msg.TopicPartition.Topic,
			Partition: 0,
			Offset:    kafka.Offset(len(producer.Produced)),
		},
	}

	return nil
}
