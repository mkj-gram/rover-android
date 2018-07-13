package kafka

import "context"

type (
	Handler interface {
		Handle(context.Context, *Message)
	}

	HandlerFunc func(context.Context, *Message)
)

func (hf HandlerFunc) Handle(ctx context.Context, msg *Message) {
	hf(ctx, msg)
}
