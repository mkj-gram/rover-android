package pubsub

import (
	"context"

	"cloud.google.com/go/pubsub"
	"github.com/pkg/errors"
	va "github.com/roverplatform/rover/go/validations"
)

type Publisher struct {
	Topic *pubsub.Topic
}

func (p *Publisher) Publish(ctx context.Context, messages ...Message) []error {
	var (
		results = make([]*pubsub.PublishResult, len(messages))
		errs    = make([]error, len(messages))
	)

	for i, message := range messages {
		if err := validateMessage(message); err != nil {
			errs[i] = err
			continue
		}

		var pm pubsub.Message

		if err := Marshal(message, &pm); err != nil {
			errs[i] = errors.Wrap(err, "Marshal")
			continue
		}

		results[i] = p.Topic.Publish(ctx, &pm)
	}

	for i, result := range results {
		if result == nil {
			continue
		}
		_, err := result.Get(ctx)
		if err != nil {
			errs[i] = errors.Wrap(err, "Get")
		}
	}

	return errs
}

func validateMessage(message Message) error {
	switch m := message.(type) {
	case *PushMessage:
		return va.All(
			va.Value("notification_body", m.NotificationBody, va.Require),
			va.Value("notification_title", m.NotificationTitle, va.Require),
			va.Value("device", m.Device, va.Require),
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
