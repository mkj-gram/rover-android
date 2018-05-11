package pipeline

import (
	"context"

	"github.com/roverplatform/rover/apis/go/event/v1"
)

// Handler interface to transform events by providing a Handle method
type Handler interface {
	Handle(ctx context.Context, e *event.Event) error
}

type HandlerFunc func(context.Context, *event.Event) error

// Handle ensures the HandlerFunc implements the Handler interface
func (h HandlerFunc) Handle(ctx context.Context, e *event.Event) error {
	return h(ctx, e)
}
