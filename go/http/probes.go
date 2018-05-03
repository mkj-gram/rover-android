package probes

import (
	"context"
	"net/http"
)

type (
	ProbeFunc func(context.Context) error

	reporter interface {
		Errorf(string, ...interface{})
	}
)

func ProbeChain(ctx context.Context, report reporter, probes ...ProbeFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var result string
		for _, probe := range probes {
			if err := probe(ctx); err != nil {
				result += err.Error() + "\n"
				if report != nil {
					report.Errorf(err.Error())
				}
			}
		}
		if result != "" {
			http.Error(w, result, http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	}
}
