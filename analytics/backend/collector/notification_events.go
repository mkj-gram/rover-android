package collector

import (
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	notification "github.com/roverplatform/rover/apis/go/notification/v1/events"
)

type NotificationEventsHandler struct {
	Interactor usecase.NotificationsInteractor
}

func getResult(result notification.PushNotificationSent_Result) domain.NotificationSentResult {
	switch result {
	case notification.PushNotificationSent_DELIVERED:
		return domain.NotificationSentResult_DELIVERED
	case notification.PushNotificationSent_UNREACHABLE:
		return domain.NotificationSentResult_UNREACHABLE
	case notification.PushNotificationSent_INVALID:
		return domain.NotificationSentResult_INVALID
	default:
		return domain.NotificationSentResult_INVALID
	}
}

func (handler *NotificationEventsHandler) Handle(msg *kafka.Message) error {
	var event notification.Event

	if err := proto.Unmarshal(msg.Value, &event); err != nil {
		// throw it away someone didn't serialize properly
		return nil
	}

	switch event := event.GetType().(type) {
	case *notification.Event_PushNotificationSent:
		return handler.handlePushNotificationSent(event.PushNotificationSent)
	case *notification.Event_NotificationAddedToNotificationCenter:
		return handler.handleNotificationAddedToNotificationCenter(event.NotificationAddedToNotificationCenter)
	default:
		return nil
	}
}

func (handler *NotificationEventsHandler) handlePushNotificationSent(event *notification.PushNotificationSent) error {
	var err = handler.Interactor.RecordSent(&domain.NotificationSentRecord{
		Timestamp:  time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)),
		AccountID:  int(event.AccountId),
		CampaignID: int(event.CampaignId),
		Channel:    domain.NotificationSentChannel_PUSH,
		Result:     getResult(event.Result),
		DeviceID:   event.DeviceId,
	})

	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			// drop it most likely because notification service didn't report proper values
			return nil
		}

		return err
	}

	return nil
}

func (handler *NotificationEventsHandler) handleNotificationAddedToNotificationCenter(event *notification.NotificationAddedToNotificationCenter) error {
	var err = handler.Interactor.RecordSent(&domain.NotificationSentRecord{
		Timestamp:  time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)),
		AccountID:  int(event.AccountId),
		CampaignID: int(event.CampaignId),
		Channel:    domain.NotificationSentChannel_NOTIFICATION_CENTER,
		Result:     domain.NotificationSentResult_DELIVERED,
		DeviceID:   event.DeviceId,
	})

	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			// drop it most likely because notification service didn't report proper values
			return nil
		}

		return err
	}

	return nil
}
