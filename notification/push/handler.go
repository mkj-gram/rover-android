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
		GetFCMClient(ctx context.Context, acctId int32, packageName string) (*fcm.Client, error)
	}

	notificationSettingsStore interface {
		OneById(ctx context.Context, campaignId int32) (*scylla.NotificationSettings, error)
	}

	notificationsStore interface {
		Create(ctx context.Context, note *scylla.Notification) error
	}

	Response struct {
		Message              notification_pubsub.Message
		Device               *notification_pubsub.Device
		NotificationSettings *scylla.NotificationSettings
		Notification         *scylla.Notification
		APNS                 struct {
			Request  interface{}
			Response interface{}
		}
		FCM struct {
			Request  interface{}
			Response interface{}
		}
	}

	HandlerFunc func(ctx context.Context, m notification_pubsub.Message) (*Response, error)
)

type Handler struct {
	ClientFactory             clientFactory
	NotificationSettingsStore notificationSettingsStore
	NotificationsStore        notificationsStore
}

func (w *Handler) Handle(ctx context.Context, m notification_pubsub.Message) (*Response, error) {

	var (
		device *notification_pubsub.Device

		mkAPNSRequest func() *apns2.Notification
		mkFCMRequest  func() *fcm.Message

		response = Response{
			Message: m,
		}
	)

	err := func() error {
		switch msg := m.(type) {
		case *notification_pubsub.PushMessage:
			settings, err := w.NotificationSettingsStore.OneById(ctx, int32(msg.CampaignID))
			if err != nil {
				if scylla.IsRetryableError(err) {
					err = &retryable{error: err}
				}
				return errors.Wrap(err, "settings.OneById")
			}

			var note scylla.Notification
			if err := PushMessageToNotification(msg, settings, &note); err != nil {
				return errors.Wrap(err, "toNotification")
			}

			if err := w.NotificationsStore.Create(ctx, &note); err != nil {
				if scylla.IsRetryableError(err) {
					err = &retryable{error: err}
				}
				return errors.Wrap(err, "notifications.Create")
			}

			if note.Id.String() == "" {
				panic(errors.Wrap(ErrInvalid, "validation: notification.id"))
			}

			response.Notification = &note
			response.NotificationSettings = settings

			if !settings.AlertOptionPushNotification {
				return nil
			}

			device = &msg.Device

			var (
				isOpenExperience = settings.TapBehaviorType == scylla.TapBehaviorType_OPEN_EXPERIENCE
				isInboxApp       = isRoverInboxAndroidApp(device.AppNamespace) || isRoverInboxIOSApp(device.AppNamespace)
			)
			if isOpenExperience && isInboxApp {
				settings.TapBehaviorUrl = roverInboxURL(settings.TapBehaviorUrl)
			}

			mkFCMRequest = func() *fcm.Message { return ToFCMRequest(m, settings, &note) }
			mkAPNSRequest = func() *apns2.Notification { return ToAPNSRequest(m, settings, &note) }

		case *notification_pubsub.SilentPush:
			device = &msg.Device

			mkFCMRequest = func() *fcm.Message { return ToFCMRequest(m, nil, nil) }
			mkAPNSRequest = func() *apns2.Notification { return ToAPNSRequest(m, nil, nil) }
		default:
			panic(errors.Wrapf(ErrUnknown, "message_type=%T", msg))
		}

		response.Device = device

		if device.PushToken == "" {
			// NOTE: devices having no push tokens are just silently skipped
			return nil
		}

		switch device.OsName {
		case OsAndroid:
			var (
				req         = mkFCMRequest()
				packageName = device.AppNamespace
			)

			response.FCM.Request = req

			client, err := w.ClientFactory.GetFCMClient(ctx, int32(device.AccountID), packageName)
			if err != nil {
				return errors.Wrap(err, "fcmfactory.GetClient")
			}

			resp, err := sendFCMRequest(ctx, client, req)
			if err != nil {
				return errors.Wrap(err, "fcm.SendPushMessage")
			}

			response.FCM.Response = resp

			return nil

		case OsiOS:
			var (
				req      = mkAPNSRequest()
				env      = strings.ToLower(device.PushTokenEnvironment)
				bundleId = device.AppNamespace
			)

			response.APNS.Request = req

			client, err := w.ClientFactory.GetAPNSClient(ctx, int32(device.AccountID), bundleId, env)
			if err != nil {
				return errors.Wrap(err, "apnsfactory.GetClient")
			}

			resp, err := sendAPNSRequest(ctx, client, req)
			if err != nil {
				return errors.Wrap(err, "apns.SendPushMessage")
			}

			response.APNS.Response = resp

			return nil

		default:
			// IDEA: maybe query for known Os-es in the first place?
			// NOTE: skip unknown OS-es
			// return errors.Wrapf(ErrUnknown, "os_name=%q", device.OsName)
		}

		return nil
	}()

	return &response, err
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
