package scheduled_notifications

import (
	"context"
	"time"

	tasks "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
	rlog "github.com/roverplatform/rover/go/logger"
)

func WithLogger(log rlog.Logger, h Handler) Handler {
	return HandlerFunc(func(ctx context.Context, task *tasks.Task) (*JobResult, error) {
		var (
			start  = time.Now()
			result *JobResult
			err    error
		)

		defer func() {
			if task != nil {
				log = log.WithFields(rlog.Fields{
					"dur":         time.Since(start),
					"campaign_id": task.CampaignId,
					"account_id":  task.AccountId,
					"task_id":     task.ID,
					"task_state":  task.State,
				})

			}

			debugFields := rlog.Fields{
				"task":   task,
				"result": result,
			}

			if err != nil {
				log.WithFields(debugFields).Error(err.Error())
			} else {
				log.WithFields(debugFields).Debug("")
				log.Infof("ok")
			}

		}()

		// work
		result, err = h.Handle(ctx, task)

		return result, err
	})
}
