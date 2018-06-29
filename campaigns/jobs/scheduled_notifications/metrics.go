package scheduled_notifications

import (
	"context"
	"time"

	jobs "github.com/roverplatform/rover/campaigns/jobs"
	tasks "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
)

func WithMetrics(h Handler) Handler {
	return HandlerFunc(func(ctx context.Context, task *tasks.Task) (*JobResult, error) {
		var (
			result *JobResult
			err    error

			start   = time.Now()
			jobName = "scheduled_notifications"
		)

		defer func() {
			jobs.Metrics.TotalCount.WithLabelValues(jobName).Inc()
			jobs.Metrics.DurationSeconds.WithLabelValues(jobName).Observe(time.Since(start).Seconds())
			if val := recover(); val != nil {
				jobs.Metrics.ErrorsCount.WithLabelValues(jobName, "panic")
				panic(val)
			}

			if err != nil {
				jobs.Metrics.ErrorsCount.WithLabelValues(jobName, "error")
			}
		}()

		result, err = h.Handle(ctx, task)

		return result, err
	})
}
