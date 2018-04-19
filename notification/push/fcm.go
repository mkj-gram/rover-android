package push

import (
	"context"
	"net"
	"time"

	fcm "github.com/appleboy/go-fcm"
	"github.com/pkg/errors"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
)

// https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
func ToFCMRequest(m notification_pubsub.Message, settings *scylla.NotificationSettings, note *scylla.Notification) *fcm.Message {
	type M map[string]interface{}

	var (
		req = &fcm.Message{
			To:           "",
			Notification: nil,
			Data:         nil,
			CollapseKey:  settings.AndroidChannelId,
		}
	)

	switch msg := m.(type) {
	case *notification_pubsub.PushMessage:
		// TODO:
		// if settings.AlertOptionBadgeNumber {
		// 	notification.Badge = fmt.Sprintf("%d", msg.Device.BadgeCount)
		// }

		req.To = msg.Device.PushToken
		req.Data = M{
			"rover": M{
				"notification": ToRoverNotification(settings, note),
			},
		}
	case *notification_pubsub.SilentPush:
		req.To = msg.Device.PushToken
		req.Data = M{
			"rover": msg.Payload,
		}

	default:
		panic(errors.Wrapf(ErrUnknown, "type=%T", msg))
	}

	return req
}

func sendFCMRequest(ctx context.Context, client *fcm.Client, req *fcm.Message) error {
	start := time.Now()
	metrics.pushTotal.WithLabelValues("fcm").Inc()

	resp, err := client.Send(req)

	metrics.pushDuration.WithLabelValues("fcm").Observe(time.Since(start).Seconds())

	switch err2 := err.(type) {
	case net.Error:
		if err2.Temporary() || err2.Timeout() {
			err = &retryable{error: err}
		}
	}

	if err != nil {
		metrics.pushErrors.WithLabelValues("fcm").Inc()
		return errors.Wrap(err, "fcm.Send")
	}

	// TODO:
	_ = resp.Error

	return nil
}
