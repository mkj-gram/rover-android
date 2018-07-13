package kafka

import (
	"github.com/confluentinc/confluent-kafka-go/kafka"
)

type (
	Message        = kafka.Message
	Event          = kafka.Event
	TopicPartition = kafka.TopicPartition
	ConfigMap      = kafka.ConfigMap

	Consumer = kafka.Consumer

	Error              = kafka.Error
	PartitionEOF       = kafka.PartitionEOF
	AssignedPartitions = kafka.AssignedPartitions
	OffsetsCommitted   = kafka.OffsetsCommitted
)

var (
	NewConsumer = kafka.NewConsumer
	NewProducer = kafka.NewProducer
)
