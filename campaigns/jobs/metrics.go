package jobs

import (
	prom "github.com/prometheus/client_golang/prometheus"
)

var (
	Metrics = struct {
		ErrorsCount         *prom.CounterVec
		TotalCount          *prom.CounterVec
		DurationSeconds     *prom.HistogramVec
		FetchLatencySeconds *prom.HistogramVec
	}{
		ErrorsCount: prom.NewCounterVec(prom.CounterOpts{
			Name: "campaigns_jobs_errors_count",
			Help: "total number of job errors",
			// job_name=scheduled_notificaiton|automated_notification error=error|panic
		}, []string{"job_name", "error"}),

		TotalCount: prom.NewCounterVec(prom.CounterOpts{
			Name: "campaigns_jobs_count",
			Help: "total number of jobs worked",
			// job_name=scheduled_notificaiton|automated_notification error=error|panic
		}, []string{"job_name"}),

		DurationSeconds: prom.NewHistogramVec(prom.HistogramOpts{
			Name:    "campaigns_jobs_duration_seconds",
			Help:    "milliseconds spent working the jobs",
			Buckets: []float64{0.001, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 5.0},
		}, []string{"job_name"}),

		FetchLatencySeconds: prom.NewHistogramVec(prom.HistogramOpts{
			Name:    "campaigns_jobs_fetch_duration_seconds",
			Help:    "milliseconds spent fetching the jobs from DB",
			Buckets: []float64{0.001, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 5.0},
		}, []string{"job_name"}),
	}

	PrometheusCollectors = []prom.Collector{
		Metrics.DurationSeconds,
		Metrics.ErrorsCount,
		Metrics.FetchLatencySeconds,
		Metrics.TotalCount,
	}
)
