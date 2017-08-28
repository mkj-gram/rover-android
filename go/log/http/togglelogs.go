package http

import (
	"fmt"
	"io"
	"net/http"
	"sync"
)

var (
	verboseOut struct {
		sync.Mutex
		on bool
	}
)

type (
	outputSetter interface {
		SetOutput(io.Writer)
	}
)

func ToggleLogs(off, on io.Writer, outs ...outputSetter) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		verboseOut.Lock()
		defer verboseOut.Unlock()

		var out io.Writer = off
		if verboseOut.on = !verboseOut.on; verboseOut.on {
			out = on
		}

		for i := range outs {
			outs[i].SetOutput(out)
		}

		fmt.Fprintf(w, "logs: %v", verboseOut.on)
	})
}
