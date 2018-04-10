package pubsub

import (
	"cloud.google.com/go/pubsub"
	"context"
	"github.com/pkg/errors"
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
		var pm pubsub.Message

		// TODO grab all errors don't terminate early
		if err := Marshal(message, &pm); err != nil {
			errs[i] = errors.Wrap(err, "Marshal")
			continue
		}

		results[i] = p.Topic.Publish(ctx, &pm)
	}

	// TODO grab all results to terminate early
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
