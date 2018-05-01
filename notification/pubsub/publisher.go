package pubsub

import (
	"context"

	"cloud.google.com/go/pubsub"
	"github.com/pkg/errors"
	va "github.com/roverplatform/rover/go/validations"
	"time"
)

type Publisher struct {
	Topic *pubsub.Topic
}

func (p *Publisher) Publish(ctx context.Context, messages ...Message) []error {
	var (
		results   = make([]*pubsub.PublishResult, len(messages))
		durations = make([]time.Time, len(messages))
		errs      = make([]error, len(messages))
	)

	for i, message := range messages {
		// Track that we are attempting to publish
		p.trackPublish(messages[i])

		if err := validateMessage(message); err != nil {
			errs[i] = err
			continue
		}

		var pm pubsub.Message

		if err := Marshal(message, &pm); err != nil {
			errs[i] = errors.Wrap(err, "Marshal")
			continue
		}

		durations[i] = time.Now()
		results[i] = p.Topic.Publish(ctx, &pm)
	}

	for i, result := range results {
		if result == nil {
			continue
		}
		_, err := result.Get(ctx)

		p.trackPublishDuration(messages[i], time.Since(durations[i]).Seconds())

		if err != nil {
			errs[i] = errors.Wrap(err, "Get")
		}
	}

	for i := range errs {
		if errs[i] != nil {
			// track any message that had a failure this could be json validation, pubsub error, etc
			p.trackPublishFailed(messages[i])
		}
	}

	return errs
}

func (p *Publisher) trackPublishDuration(message Message, seconds float64) {
	metrics.publisherDuration.WithLabelValues(getMessageLabel(message)).Observe(seconds)
}

func (p *Publisher) trackPublishFailed(message Message) {
	metrics.publisherTotalFailed.WithLabelValues(getMessageLabel(message)).Inc()
}

func (p *Publisher) trackPublish(message Message) {
	metrics.publisherTotal.WithLabelValues(getMessageLabel(message)).Inc()
}

func validateMessage(message Message) error {
	switch m := message.(type) {
	case *PushMessage:
		return va.All(
			va.Value("notification_body", m.NotificationBody, va.Require),
			va.Value("notification_title", m.NotificationTitle, va.Require),
			va.Value("device.id", m.Device.ID, va.Require),
		)

	case *SilentPush:
		return va.All(
			va.Value("device.id", m.Device.ID, va.Require),
			va.Value("device.push_token", m.Device.PushToken, va.Require),
		)

	default:
		return nil
	}

}
