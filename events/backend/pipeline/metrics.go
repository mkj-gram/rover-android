package pipeline

import (
	prom "github.com/prometheus/client_golang/prometheus"
)

var metrics = struct {
	pipelineEventsProcessedDurationSeconds *prom.HistogramVec
	pipelineEventsProcessedErrorsTotal     *prom.CounterVec
	pipelineEventsProcessedTotal           *prom.CounterVec

	kafkaConsumerOffset *prom.GaugeVec
}{

	//
	// Processed Events
	//

	pipelineEventsProcessedTotal: prom.NewCounterVec(prom.CounterOpts{
		Name: "pipeline_events_processed_total",
		Help: "total pipeline events processed",
	}, []string{"account_id", "namespace", "name"}),

	pipelineEventsProcessedDurationSeconds: prom.NewHistogramVec(prom.HistogramOpts{
		Name:    "pipeline_events_processed_duration_seconds",
		Help:    "duration processing events in seconds",
		Buckets: []float64{0.005, 0.01, 0.025, 0.05, 0.1, 0.25},
	}, []string{"account_id", "namespace", "name"}),

	pipelineEventsProcessedErrorsTotal: prom.NewCounterVec(prom.CounterOpts{
		Name: "pipeline_events_errors_total",
		Help: "total pipeline events processing errors including panics",
	}, []string{"account_id", "namespace", "name", "error"}),

	kafkaConsumerOffset: prom.NewGaugeVec(prom.GaugeOpts{
		Name: "kafka_consumer_group_offset",
		Help: "current consumer group offset",
	}, []string{"topic", "partition", "group_id"}),
}

var PrometheusMetrics = []prom.Collector{
	metrics.pipelineEventsProcessedTotal,
	metrics.pipelineEventsProcessedDurationSeconds,
	metrics.pipelineEventsProcessedErrorsTotal,
	metrics.kafkaConsumerOffset,
}
