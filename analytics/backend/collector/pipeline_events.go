package collector

import (
	"strconv"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	pipeline "github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
)

type PipelineEventsHandler struct {
	NotificationInteractor usecase.NotificationsInteractor
}

func (handler *PipelineEventsHandler) Handle(msg *kafka.Message) error {
	var event = pipeline.Event{}
	if err := proto.Unmarshal(msg.Value, &event); err != nil {
		// TODO warn here
		return nil
	}

	if event.Namespace != "rover" {
		// We are only capturing rover events
		return nil
	}

	switch event.Name {
	case "Notification Opened":
		return handler.handleNotificationOpened(&event)
	default:
		// unknown rover event skip
		return nil
	}
}

func (handler *PipelineEventsHandler) handleNotificationOpened(event *pipeline.Event) error {
	/*
		Note only return an error if you are unable to handle the event
		for example when the db is down. Any validation errors should skip over by returning no error
	*/
	value, ok := event.GetAttributes().GetFields()["campaignID"]
	if !ok {
		// TODO log warning here
		return nil
	}

	campaignIDValue, ok := value.GetKind().(*structpb.Value_StringValue)
	if !ok {
		return nil
	}

	campaignID, err := strconv.ParseInt(campaignIDValue.StringValue, 10, 64)
	if err != nil {
		// TODO warn here
		return nil
	}

	value, ok = event.GetAttributes().GetFields()["source"]
	if !ok {
		// There was no source associated with this open we can't assume anything here just move on
		return nil
	}

	source, ok := value.GetKind().(*structpb.Value_StringValue)
	if !ok {
		return nil
	}

	var record = &domain.NotificationOpenedRecord{
		Timestamp:  time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)),
		AccountID:  int(event.GetAuthContext().GetAccountId()),
		CampaignID: int(campaignID),
		DeviceID:   event.GetDevice().GetDeviceIdentifier(),
	}

	switch source.StringValue {
	case "pushNotification":
		record.Source = domain.NotificationOpenSource_PUSH
		record.SubSource = domain.NotificationOpenSubSource_DIRECT
	case "influencedOpen":
		record.Source = domain.NotificationOpenSource_PUSH
		record.SubSource = domain.NotificationOpenSubSource_INFLUENCED
	case "notificationCenter":
		record.Source = domain.NotificationOpenSource_NOTIFICATION_CENTER
		record.SubSource = domain.NotificationOpenSubSource_NONE
	default:
		return nil
	}

	err = handler.NotificationInteractor.RecordOpened(record)
	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			return nil
		}
		return err
	}

	return nil
}
