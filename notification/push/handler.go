package push

import (
	"context"
	"strings"

	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"

	fcm "github.com/appleboy/go-fcm"
	"github.com/pkg/errors"
	"github.com/sideshow/apns2"
)

const (
	OsAndroid = "Android"
	OsiOS     = "iOS"
)

type (
	clientFactory interface {
		GetAPNSClient(ctx context.Context, acctId int32, bundleId string, env string) (*apns2.Client, error)
		GetFCMClient(ctx context.Context, acctId int32) (*fcm.Client, error)
	}

	notificationSettingsStore interface {
		OneById(ctx context.Context, campaignId int32) (*scylla.NotificationSettings, error)
	}

	notificationsStore interface {
		Create(ctx context.Context, note *scylla.Notification) error
	}
)

type Handler struct {
	ClientFactory             clientFactory
	NotificationSettingsStore notificationSettingsStore
	NotificationsStore        notificationsStore
}

func (w *Handler) Handle(ctx context.Context, m notification_pubsub.Message) error {

	var (
		device *notification_pubsub.Device

		mkAPNSRequest func() *apns2.Notification
		mkFCMRequest  func() *fcm.Message
	)

	switch msg := m.(type) {
	case *notification_pubsub.PushMessage:

		settings, err := w.NotificationSettingsStore.OneById(ctx, int32(msg.CampaignID))
		if err != nil {
			// TODO: check if retriable
			return errors.Wrap(err, "settings.OneById")
		}

		var note scylla.Notification
		if err := PushMessageToNotification(msg, settings, &note); err != nil {
			return errors.Wrap(err, "toNotification")
		}

		if err := w.NotificationsStore.Create(ctx, &note); err != nil {
			// TODO: check if retriable
			return errors.Wrap(err, "notifications.Create")
		}

		if note.Id.String() == "" {
			panic(errors.Wrap(ErrInvalid, "validation: notification.id"))
		}

		// TODO: check for push token

		if !settings.AlertOptionPushNotification {
			return nil
		}

		device = &msg.Device
		mkFCMRequest = func() *fcm.Message { return ToFCMRequest(m, settings, &note) }
		mkAPNSRequest = func() *apns2.Notification { return ToAPNSRequest(m, settings, &note) }

	case *notification_pubsub.SilentPush:
		device = &msg.Device
		mkFCMRequest = func() *fcm.Message { return ToFCMRequest(m, nil, nil) }
		mkAPNSRequest = func() *apns2.Notification { return ToAPNSRequest(m, nil, nil) }
	default:
		panic(errors.Wrapf(ErrUnknown, "message_type=%T", msg))
	}

	switch device.OsName {
	case OsAndroid:
		var (
			req = mkFCMRequest()
		)

		client, err := w.ClientFactory.GetFCMClient(ctx, int32(device.AccountID))
		if err != nil {
			return errors.Wrap(err, "fcmfactory.GetClient")
		}

		if err := sendFCMRequest(ctx, client, req); err != nil {
			return errors.Wrap(err, "fcm.SendPushMessage")
		}

		return nil

	case OsiOS:
		var (
			req      = mkAPNSRequest()
			env      = strings.ToLower(device.PushTokenEnvironment)
			bundleId = device.AppNamespace
		)

		client, err := w.ClientFactory.GetAPNSClient(ctx, int32(device.AccountID), bundleId, env)
		if err != nil {
			return errors.Wrap(err, "apnsfactory.GetClient")
		}

		if err := sendAPNSRequest(ctx, client, req); err != nil {
			return errors.Wrap(err, "apns.SendPushMessage")
		}

		return nil

	default:
		return errors.Wrapf(ErrUnknown, "os_name=%q", device.OsName)
	}

	return nil
}

func PushMessageToNotification(msg *notification_pubsub.PushMessage, settings *scylla.NotificationSettings, note *scylla.Notification) error {
	// auto generated
	note.Id = scylla.TimeUUID()
	note.AccountId = settings.AccountID
	note.CampaignId = settings.CampaignId

	note.IsTest = msg.IsTest

	note.DeviceId = msg.Device.ID

	note.Body = msg.NotificationBody
	note.Title = msg.NotificationTitle

	note.IsDeleted = false
	note.IsRead = false

	return nil
}
