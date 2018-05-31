package pipeline

import (
	"context"
	"testing"

	"github.com/roverplatform/rover/apis/go/event/v1"
)

func TestChain_ThenCallsAllHandlersInChain(t *testing.T) {

	t.Parallel()

	var called = [10]bool{}
	chain := chain{}

	addToChain := func(i int) {
		chain.Then(HandlerFunc(func(ctx Context, e *event.Event) error {
			called[i] = true
			return nil
		}))
	}

	for i := 0; i < 10; i++ {
		addToChain(i)
	}

	// Call the Handle function to initialize the chain execution
	chain.Handle(NewContext(context.Background()), &event.Event{})

	for i, result := range called {
		if result == false {
			t.Fatalf("Handler at [%d] was not called", i)
		}
	}
}
