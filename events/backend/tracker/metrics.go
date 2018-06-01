package tracker

import "github.com/prometheus/client_golang/prometheus"

var metrics = struct {
	schemaUpdatesTotal       *prometheus.CounterVec
	schemaUpdatesErrorsTotal *prometheus.CounterVec
	schemaMismatchTotal      *prometheus.CounterVec
}{

	schemaUpdatesTotal: prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "pipeline_schema_updates_total",
		Help: "total number of schema updates",
	}, []string{"account_id", "namespace", "name"}),

	schemaUpdatesErrorsTotal: prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "pipeline_schema_updates_errors_total",
		Help: "total number of schema updates",
	}, []string{"account_id", "namespace", "name"}),

	schemaMismatchTotal: prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "pipeline_events_schema_mismatch_total",
		Help: "number of events that do not conform to their current schema",
	}, []string{"account_id", "namespace", "name"}),
}

var PrometheusMetrics = []prometheus.Collector{
	metrics.schemaUpdatesTotal,
	metrics.schemaUpdatesErrorsTotal,
	metrics.schemaMismatchTotal,
}
