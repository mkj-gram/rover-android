package db

import (
	sn "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
	"testing"
)

func TestState(t *testing.T) {
	// ensure both APIs use same values
	// without coupling
	if !(stateQueued == sn.TaskStateQueued && stateCancelled == sn.TaskStateCancelled) {
		t.Fatal("expectations failed")
	}
}
