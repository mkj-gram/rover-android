package pipeline

import (
	"github.com/roverplatform/rover/apis/go/event/v1"
)

// Handler interface to transform events by providing a Handle method
type Handler interface {
	Handle(ctx Context, e *event.Event) error
}

type HandlerFunc func(Context, *event.Event) error

// Handle ensures the HandlerFunc implements the Handler interface
func (h HandlerFunc) Handle(ctx Context, e *event.Event) error {
	return h(ctx, e)
}
