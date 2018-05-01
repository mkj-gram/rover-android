package push

import (
	"context"
	"fmt"
	"time"

	"github.com/pkg/errors"
	"github.com/sideshow/apns2"

	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
)

type (
	ApsPayload struct {
		Alert            interface{} `json:"alert,omitempty"`
		Badge            interface{} `json:"badge,omitempty"`
		Category         string      `json:"category,omitempty"`
		ContentAvailable int         `json:"content-available,omitempty"`
		MutableContent   int         `json:"mutable-content,omitempty"`
		Sound            string      `json:"sound,omitempty"`
		ThreadID         string      `json:"thread-id,omitempty"`
		URLArgs          []string    `json:"url-args,omitempty"`
	}

	ApsAlert struct {
		Action       string   `json:"action,omitempty"`
		ActionLocKey string   `json:"action-loc-key,omitempty"`
		Body         string   `json:"body,omitempty"`
		LaunchImage  string   `json:"launch-image,omitempty"`
		LocArgs      []string `json:"loc-args,omitempty"`
		LocKey       string   `json:"loc-key,omitempty"`
		Title        string   `json:"title,omitempty"`
		Subtitle     string   `json:"subtitle,omitempty"`
		TitleLocArgs []string `json:"title-loc-args,omitempty"`
		TitleLocKey  string   `json:"title-loc-key,omitempty"`
	}
)

// see https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html#//apple_ref/doc/uid/TP40008194-CH17-SW1
func ToAPNSRequest(m notification_pubsub.Message, settings *scylla.NotificationSettings, note *scylla.Notification) *apns2.Notification {
	type M map[string]interface{}

	var (
		boolToInt = func(b bool) int {
			if b {
				return 1
			}
			return 0
		}

		alert = func(msg *notification_pubsub.PushMessage) ApsPayload {
			var (
				alert = ApsAlert{
					Body:  note.Body,
					Title: note.Title,
					// TitleLocArgs
					// TitleLocKey
					// Subtitle
					// Action:
					// ActionLocKey
					// LocArgs
					// LocKey
				}

				apsPayload = ApsPayload{
					Alert: alert,
					Badge: nil, // see below
					// URLArgs
					// only for silent push
					ContentAvailable: boolToInt(settings.IosContentAvailable),
					MutableContent:   1,
					Sound:            settings.IosSound,
					ThreadID:         settings.IosThreadIdentifier,
					Category:         settings.IosCategoryIdentifier,
				}
			)

			if settings.AlertOptionBadgeNumber {
				apsPayload.Badge = msg.Device.BadgeCount
			}

			return apsPayload
		}

		req = &apns2.Notification{
			ApnsID:     note.Id.String(),
			CollapseID: settings.IosThreadIdentifier,
			// TODO:
			// Expiration: settings.Expiration
		}
	)

	switch msg := m.(type) {
	case *notification_pubsub.PushMessage:
		req.DeviceToken = msg.Device.PushToken
		req.Topic = msg.Device.AppNamespace
		req.Payload = M{
			"aps": alert(msg),
			"rover": M{
				"notification": ToRoverNotification(settings, note),
			},
		}
	case *notification_pubsub.SilentPush:
		req.DeviceToken = msg.Device.PushToken
		req.Topic = msg.Device.AppNamespace
		req.Payload = M{
			"aps":   M{"content-available": 1},
			"rover": msg.Payload,
		}
	default:
		panic(errors.Wrapf(ErrUnknown, "type=%T", msg))
	}

	return req
}

func sendAPNSRequest(ctx context.Context, client *apns2.Client, req *apns2.Notification) error {
	start := time.Now()
	metrics.pushTotal.WithLabelValues("apns").Inc()

	resp, err := client.PushWithContext(ctx, req)

	metrics.pushDuration.WithLabelValues("apns").Observe(time.Since(start).Seconds())

	if err != nil {
		metrics.pushErrors.WithLabelValues("apns").Inc()
		return errors.Wrap(err, "apns.Push")
	}

	metrics.pushResponseStatus.WithLabelValues("apns", fmt.Sprintf("%d", resp.StatusCode)).Inc()

	err = errors.Errorf("status=%d reason=%q apns_id=%q", resp.StatusCode, resp.Reason, resp.ApnsID)
	switch {
	case resp.StatusCode >= 500 && resp.StatusCode < 600:
		// service errors
		return retryable{error: err}
	case resp.StatusCode >= 400 && resp.StatusCode < 500:
		// client errors
		return err
	case resp.StatusCode >= 300 && resp.StatusCode < 400:
		// redirection
		return err
	case resp.StatusCode >= 200 && resp.StatusCode < 300:
		// success
		return nil
	default:
		return err
	}

	return nil
}
