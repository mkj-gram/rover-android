package pipeline

import (
	"context"
	"fmt"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"

	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/go/logger"
)

type Producer interface {
	Close()
	Produce(*kafka.Message, chan kafka.Event) error
}

type Consumer interface {
	Subscribe(string, kafka.RebalanceCb) error
	Close() error
	Poll(int) kafka.Event
	CommitMessage(*kafka.Message) ([]kafka.TopicPartition, error)
}

type Pipeline struct {
	Handler Handler

	logger logger.Logger

	// Input & Output
	source source
	sink   sink

	// Overridable with options
	timeNow func() time.Time
	backoff *Backoff

	// private
	runningChan  chan bool
	shutdownChan chan bool
}

type source struct {
	topic    string
	consumer Consumer
}

type sink struct {
	topic    string
	producer Producer
}

// Represents a kafka message that has been processed with its corresponding output kafka message
type processedMessage struct {
	// The message we consumed from kafka
	InputMessage *kafka.Message

	// The processed message based on InputMessage
	OutputMessage *kafka.Message
}

var (
	invalidEventMissingIdError   = errors.New("id is missing")
	invalidEventMissingNameError = errors.New("name is missing")
)

func NewPipeline(consumer Consumer, inputTopic string, producer Producer, outputTopic string, handler Handler, options ...Option) *Pipeline {
	var defaultLogger = logger.New()
	defaultLogger.SetLevel(logger.ErrorLevel)

	pipe := &Pipeline{
		source: source{
			consumer: consumer,
			topic:    inputTopic,
		},
		sink: sink{
			producer: producer,
			topic:    outputTopic,
		},
		Handler: handler,

		logger: defaultLogger,

		timeNow: time.Now,
		backoff: &Backoff{
			MaxAttempts: 10,
			Min:         10 * time.Millisecond,
			Max:         30 * time.Second,
			Factor:      2,
			Jitter:      false,
		},

		runningChan:  make(chan bool, 1),
		shutdownChan: make(chan bool, 1),
	}

	for _, op := range options {
		op(pipe)
	}

	return pipe
}

// Run the pipeline.
func (p *Pipeline) Run(ctx context.Context) error {
	p.logger.Debugf("subscribing to kafka topic: %s", p.source.topic)
	if err := p.source.consumer.Subscribe(p.source.topic, nil); err != nil {
		return err
	}
	p.logger.Debug("successfully subscribed to topic")
	return p.loop(ctx)
}

// Shutdown the pipeline waiting for outstanding messages to be processed or the timeout occurs
func (p *Pipeline) Shutdown(timeout time.Duration) {

	select {
	case <-p.runningChan:
		// runningChan is already closed
	default:
		close(p.runningChan)
	}

	select {
	case <-time.After(timeout):
		p.logger.Error("Abrupt shutdown")
	case <-p.shutdownChan:
		p.logger.Info("Finished clean")
	}

	err := p.source.consumer.Close()
	if err != nil {
		p.logger.Error(err)
	}

	p.sink.producer.Close()
}

// Main work function which is responsible for detecting when to shutdown or continue to process messages from kafka
func (p *Pipeline) loop(ctx context.Context) error {
	var lastError error

out:
	for {
		select {
		case <-p.runningChan:
			break out
		case <-ctx.Done():
			break out
		default:
			if err := p.next(); err != nil {
				lastError = err
				break out
			}
		}
	}

	p.shutdownChan <- true

	return lastError
}

// Get the next message from kafka input topic and delegate to appropriate functions
func (p *Pipeline) next() error {

	input := p.source.consumer.Poll(10)
	if input == nil {
		// There is no data to consume
		return nil
	}

	switch e := input.(type) {
	case *kafka.Message:
		return p.handle(e)
	case kafka.Error:
		// Should probably disconnect?
		return e
	case kafka.PartitionEOF, kafka.OffsetsCommitted:
		return nil
	default:
		return errors.Errorf("Unknown kafka event: %v", e)
	}

	return nil
}

func (p *Pipeline) handle(in *kafka.Message) error {
	var (
		out *kafka.Message
		err error

		currentAttempt = 0

		scopedLog = p.logger.WithFields(logger.Fields{
			"topic":     in.TopicPartition.Topic,
			"partition": in.TopicPartition.Partition,
			"offset":    in.TopicPartition.Offset,
		})
	)

	scopedLog.Debug("new message from source")

	// Keep retrying until we hit max attempts of 5?
	for currentAttempt < p.backoff.MaxAttempts {
		out, err = p.process(in)
		if err != nil && IsRetryableError(errors.Cause(err)) {
			scopedLog.Debugf("attempt: %d failed, error: %v", currentAttempt, err)
			time.Sleep(p.backoff.ForAttempt(currentAttempt))
			currentAttempt++
		} else {
			break
		}
	}

	if err != nil {
		if IsRetryableError(errors.Cause(err)) {
			panic(fmt.Errorf("attempted too many times to process message: %v", in))
		}

		scopedLog.Error(err)
	}

	done := &processedMessage{
		InputMessage:  in,
		OutputMessage: out,
	}

	scopedLog.Debug("message processed")

	err = p.complete(done)
	if err != nil {
		scopedLog.Error(errors.Wrap(err, "complete"))
		return err
	}

	return nil
}

// Process an individual message from kafka by parsing the protobuf message from a kafka and passing the protobuf message to a list of transformers
// Each transformer has the opportunity to modify or add data to the original protobuf message
//
// Example Use Case:
// 		Each location update event from our sdk only reports the latitude and longitude of where the device is
//		We can transform this original event by reverse geocoding the latitude and longitude and adding Country, Province, Street
func (p *Pipeline) process(in *kafka.Message) (out *kafka.Message, err error) {
	var (
		ctx   = NewContext(context.Background())
		data  = in.Value
		key   = in.Key
		input = event.Event{}
		start = time.Now()

		scopedLog = p.logger.WithFields(logger.Fields{
			"topic":     in.TopicPartition.Topic,
			"partition": in.TopicPartition.Partition,
			"offset":    in.TopicPartition.Offset,
		})
	)

	defer func() {
		var errKind = "error"

		if r := recover(); r != nil {
			// transformer has most likely panicked
			out = nil
			errKind = "panic"

			scopedLog.WithFields(logger.Fields{
				"stack": errors.Errorf("%+v", errors.WithStack(errors.Errorf("%v"))),
			}).Error(r)

			defer func() {
				panic(r)
			}()
		}

		labels := []string{
			fmt.Sprint(input.AuthContext.GetAccountId()),
			input.Namespace,
			input.Name,
		}

		metrics.pipelineEventsProcessedTotal.
			WithLabelValues(labels...).Inc()

		metrics.pipelineEventsProcessedDurationSeconds.
			WithLabelValues(labels...).Observe(time.Since(start).Seconds())

		if err != nil {
			metrics.pipelineEventsProcessedErrorsTotal.
				WithLabelValues(append(labels, errKind)...).Inc()
		}
	}()

	// Parse the protobuf data
	err = proto.Unmarshal(data, &input)
	if err != nil {
		return nil, errors.Wrap(err, "proto.Unmarshal")
	}

	if err = valid(&input); err != nil {
		return nil, errors.Wrap(err, "validation error")
	}

	scopedLog.WithFields(logger.Fields{
		"namespace": input.Namespace,
		"name":      input.Name,
		"device":    input.GetDevice().GetDeviceIdentifier(),
	}).Debug("handling message")

	err = p.Handler.Handle(ctx, &input)
	if err != nil {
		return nil, errors.Wrap(err, "Handler.Handle")
	}

	// Generate the output kafka message which re-uses the same key for partitioning but the transformed protobuf message as the new value
	value, err := proto.Marshal(&input)
	if err != nil {
		return nil, errors.Wrap(err, "proto.Marshal")
	}

	out = &kafka.Message{TopicPartition: kafka.TopicPartition{Topic: &p.sink.topic}, Key: key, Value: value, Timestamp: p.timeNow()}

	return out, nil

}

// Complete the processing of a message in from kafka by producing the out message. At the same time we commit the in message offset
// to signal to kafka that the message was consumed and handled. The following is a blocking call
//
// When out is nil we assume there is nothing to produce so we just commit the offset
func (p *Pipeline) complete(processed *processedMessage) error {

	var (
		in  = processed.InputMessage
		out = processed.OutputMessage
	)

	if out != nil {
		deliveryChan := make(chan kafka.Event, 1)
		defer close(deliveryChan)
		err := p.sink.producer.Produce(out, deliveryChan)
		if err != nil {
			return errors.Wrap(err, "kafka.Produce")
		}

		switch m := (<-deliveryChan).(type) {
		case *kafka.Message:
			if m.TopicPartition.Error != nil {
				// We failed to produce the out message
				// This is bad could be because of network error or miss-configuration
				// This means we can retry everything
				return m.TopicPartition.Error
			}
		case *kafka.Error:
			return errors.Wrap(m, "kafka.Produce")

		default:
			return errors.Wrap(errors.Errorf("unknown kafka event: %v", m), "kafka.Produce")
		}
	}

	// We have either produced the out message successfully or there wasn't one
	// We can now acknowledge the in message
	_, err := p.source.consumer.CommitMessage(in)
	if err != nil {
		return errors.Wrap(err, "kafka.CommitMessage")
	}

	return nil
}

// Checks if an event is valid for processing
func valid(event *event.Event) error {
	if event.Id == "" {
		return invalidEventMissingIdError
	}

	if event.Name == "" {
		return invalidEventMissingNameError
	}

	return nil
}
