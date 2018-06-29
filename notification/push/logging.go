package push

import (
	"context"
	"time"

	rlog "github.com/roverplatform/rover/go/logger"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
)

func WithLogging(log rlog.Logger, handler HandlerFunc) HandlerFunc {
	return HandlerFunc(func(ctx context.Context, m notification_pubsub.Message) (*Response, error) {
		var (
			start = time.Now()
			resp  *Response
			err   error
		)

		defer func() {
			var (
				log = log.WithFields(rlog.Fields{
					"dur": time.Since(start),
				})

				debugFields = rlog.Fields{
					"req":  m,
					"resp": resp,
				}
			)

			switch msg := m.(type) {
			case *notification_pubsub.PushMessage:
				debugFields["device_id"] = msg.Device.ID
				debugFields["account_id"] = msg.Device.AccountID
				debugFields["campaign_id"] = msg.CampaignID
				// debugFields["campaign.id"] =
			case *notification_pubsub.SilentPush:
				debugFields["device_id"] = msg.Device.ID
				debugFields["account_id"] = msg.Device.AccountID
				// TODO:?
				// debugFields["campaign.id"] =
			}

			if err != nil {
				log.WithFields(debugFields).Error(err.Error())
			} else {
				log.WithFields(debugFields).Debug("")
			}
		}()

		resp, err = handler(ctx, m)

		return resp, err
	})
}
