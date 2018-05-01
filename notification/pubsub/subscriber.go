package pubsub

import (
	"cloud.google.com/go/pubsub"
	"context"
	"github.com/pkg/errors"
)

type ReceiverFunc func(ctx context.Context, message Message) error

type retryable interface {
	RetryableError() error
}

type Subscriber struct {
	Subscription *pubsub.Subscription
}

func (s *Subscriber) Subscribe(parentCtx context.Context, receiver ReceiverFunc) error {

	var onReceive = func(ctx context.Context, m *pubsub.Message) {
		msg, err := Unmarshal(m)
		if err != nil {
			// TODO log unmarshal error we should not retry
			metrics.subscriberTotal.WithLabelValues("").Inc()
			m.Ack()
			return
		}

		metrics.subscriberTotal.WithLabelValues(getMessageLabel(msg)).Inc()

		if err := receiver(ctx, msg); err != nil {
			if _, ok := errors.Cause(err).(retryable); ok {
				m.Nack()
				return
			}
		}

		m.Ack()
	}

	if err := s.Subscription.Receive(parentCtx, onReceive); err != nil {
		return errors.Wrap(err, "Receive")
	}

	return nil
}
