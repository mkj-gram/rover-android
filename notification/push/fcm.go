package push

import (
	"context"
	"net"

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

		// NOTE: Badge is not supported for Android
		// if settings.AlertOptionBadgeNumber && msg.Device.AppBadgeNumber != nil {
		// }

		req.To = msg.Device.PushToken

		var payload M
		if msg.Device.SdkVersion.Major == 1 {
			payload = M{
				"_rover":  true,
				"message": ToLegacyRoverNotification(settings, note),
			}
		} else {
			payload = M{
				"rover": M{
					"notification": ToRoverNotification(settings, note),
				},
			}
		}
		req.Data = payload
	case *notification_pubsub.SilentPush:
		req.To = msg.Device.PushToken
		req.Data = M{
			"action": msg.Payload,
		}

	default:
		panic(errors.Wrapf(ErrUnknown, "type=%T", msg))
	}

	return req
}

func sendFCMRequest(ctx context.Context, client *fcm.Client, req *fcm.Message) (*fcm.Response, error) {
	resp, err := client.Send(req)

	switch err2 := err.(type) {
	case net.Error:
		if err2.Temporary() || err2.Timeout() {
			err = &retryable{error: err}
		}
	}

	if err != nil {
		return resp, errors.Wrap(err, "fcm.Send")
	}

	return resp, nil
}
