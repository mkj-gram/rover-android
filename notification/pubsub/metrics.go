package pubsub

import "github.com/prometheus/client_golang/prometheus"

var metrics = struct {
	publisherTotal       *prometheus.CounterVec
	publisherTotalFailed *prometheus.CounterVec
	publisherDuration    *prometheus.HistogramVec

	subscriberTotal *prometheus.CounterVec
}{
	publisherTotal: prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: "notification",
		Name:      "pubsub_publish_total",
		Help:      "Total number of pubsub publishes by type",
	}, []string{"type"}),

	publisherTotalFailed: prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: "notification",
		Name:      "pubsub_publish_errors_total",
		Help:      "Total number of failed pubsub publishes",
	}, []string{"type"}),

	publisherDuration: prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: "notification",
		Name:      "pubsub_publish_duration_seconds",
		Help:      "Seconds to publish a message to pubsub",
		// 5ms 10ms 25ms 50ms 100ms
		Buckets: []float64{0.005, 0.01, 0.025, 0.05, 0.1},
	}, []string{"type"}),

	subscriberTotal: prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: "notification",
		Name:      "pubsub_receive_total",
		Help:      "The total number of pubsub messages received by type",
	}, []string{"type"}),
}

var PrometheusMetrics = []prometheus.Collector{
	metrics.publisherTotal,
	metrics.publisherTotalFailed,
	metrics.publisherDuration,
	metrics.subscriberTotal,
}

func getMessageLabel(message Message) string {
	switch message.(type) {
	case *PushMessage:
		return "PushMessage"
	case *SilentPush:
		return "SilentPush"
	default:
		return ""
	}
}
