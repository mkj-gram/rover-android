package push

import (
	"context"
	"time"

	prom "github.com/prometheus/client_golang/prometheus"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
)

var metrics = struct {
	jobsTotal           prom.Counter
	jobsErrors          *prom.CounterVec
	jobsDurationSeconds prom.Counter

	pushTotal          *prom.CounterVec
	pushResponseStatus *prom.CounterVec
	pushErrors         *prom.CounterVec
	pushDuration       *prom.HistogramVec
}{

	//
	// Jobs
	//

	jobsErrors: prom.NewCounterVec(prom.CounterOpts{
		Namespace: "notification",
		Name:      "jobs_errors_total",
		Help:      "job errors total",
	}, []string{"error"}),

	jobsTotal: prom.NewCounter(prom.CounterOpts{
		Namespace: "notification",
		Name:      "jobs_total",
		Help:      "jobs total",
	}),

	jobsDurationSeconds: prom.NewCounter(prom.CounterOpts{
		Namespace: "notification",
		Name:      "jobs_duration_seconds",
		Help:      "jobs duration seconds",
	}),

	//
	// push messages
	//

	pushTotal: prom.NewCounterVec(prom.CounterOpts{
		Namespace: "notification",
		Name:      "push_requests_total",
		Help:      "push requests total",
	}, []string{"gateway"}),

	pushResponseStatus: prom.NewCounterVec(prom.CounterOpts{
		Namespace: "notification",
		Name:      "push_requests_response_status",
		Help:      "push requests response statuses",
	}, []string{"gateway", "status"}),

	pushErrors: prom.NewCounterVec(prom.CounterOpts{
		Namespace: "notification",
		Name:      "push_request_errors_total",
		Help:      "push request errors",
	}, []string{"gateway"}),

	pushDuration: prom.NewHistogramVec(prom.HistogramOpts{
		Namespace: "notification",
		Name:      "push_request_duration_seconds",
		Help:      "push request durations histogram",
		// 5ms 10ms 25ms 50ms 100ms 250ms
		Buckets: []float64{0.005, 0.01, 0.025, 0.05, 0.1, 0.25},
	}, []string{"gateway"}),
}

var PrometheusMetrics = []prom.Collector{
	metrics.jobsTotal,
	metrics.jobsErrors,
	metrics.jobsDurationSeconds,

	metrics.pushDuration,
	metrics.pushErrors,
	metrics.pushResponseStatus,
	metrics.pushTotal,
}

func WithMetrics(h HandlerFunc) HandlerFunc {
	return HandlerFunc(func(ctx context.Context, m notification_pubsub.Message) (*Response, error) {
		var start = time.Now()
		defer func() {
			metrics.jobsTotal.Inc()
			metrics.jobsDurationSeconds.Add(time.Since(start).Seconds())
			if val := recover(); val != nil {
				metrics.jobsErrors.WithLabelValues("panic").Inc()
				panic(val)
			}
		}()

		var resp, err = h(ctx, m)

		if err != nil {
			metrics.jobsErrors.WithLabelValues("error").Inc()
			return resp, err
		}

		return resp, nil
	})
}
