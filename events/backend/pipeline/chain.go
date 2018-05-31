package pipeline

import (
	"github.com/roverplatform/rover/apis/go/event/v1"
)

// Ensure chain implements a Handler
var _ Handler = (*chain)(nil)

// chain holds a list of handlers and runs them in sequential order until an error occurs
type chain struct {
	name     string
	handlers []Handler
}

// NewChain construct a new chain with a name
func NewChain(name string) *chain {
	return &chain{name: name}
}

// Handle implements pipeline.Handler by sequential calling all of the handlers that have been added to the chain
// if an error occurs the chain breaks and returns the error without calling the rest of the handlers
func (c chain) Handle(ctx Context, e *event.Event) error {
	var err error

	for _, handler := range c.handlers {
		err = handler.Handle(ctx, e)
		if err != nil {
			return err
		}
	}

	return nil
}

// Then append a Handler to the list of handlers. This Handler will be called after previous handlers in the chain
func (c *chain) Then(handler Handler) *chain {
	c.handlers = append(c.handlers, handler)
	return c
}
