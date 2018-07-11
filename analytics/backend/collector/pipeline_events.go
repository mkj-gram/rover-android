package collector

import (
	"errors"
	"strconv"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	pipeline "github.com/roverplatform/rover/apis/go/event/v1"
)

type PipelineEventsHandler struct {
	NotificationInteractor usecase.NotificationsInteractor
	ExperienceInteractor   usecase.ExperienceInteractor
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
	case "Experience Viewed":
		return handler.handleExperienceViewed(&event)
	case "Screen Viewed":
		return handler.handleExperienceScreenViewed(&event)
	case "Block Tapped":
		return handler.handleExperienceBlockTapped(&event)
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
	var campaignID int
	if campaignIDValue, ok := event.GetAttributes().GetString("campaignID"); ok {
		if id, err := strconv.ParseInt(campaignIDValue, 10, 64); err == nil {
			campaignID = int(id)
		}
	}

	source, ok := event.GetAttributes().GetString("source")
	if !ok {
		// There was no source associated with this open we can't assume anything here just move on
		return nil
	}

	var record = &domain.NotificationOpenedRecord{
		Timestamp:  time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)),
		AccountID:  int(event.GetAuthContext().GetAccountId()),
		CampaignID: int(campaignID),
		DeviceID:   event.GetDevice().GetDeviceIdentifier(),
	}

	switch source {
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

	err := handler.NotificationInteractor.RecordOpened(record)
	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			return nil
		}
		return err
	}

	return nil
}

func (handler *PipelineEventsHandler) handleExperienceViewed(event *pipeline.Event) error {
	if event.GetTimestamp() == nil {
		// TODO warn
		return nil
	}

	fields, err := getExperienceFields(event)
	if err != nil {
		return nil
	}

	var record = &domain.ExperienceViewedRecord{
		Timestamp:    time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)).UTC(),
		AccountID:    int(event.GetAuthContext().GetAccountId()),
		CampaignID:   fields.campaignID,
		ExperienceID: fields.experienceID,
		Duration:     fields.duration,
		DeviceID:     event.GetDevice().GetDeviceIdentifier(),
	}

	err = handler.ExperienceInteractor.RecordViewed(record)
	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			return nil
		}
		return err
	}

	return nil
}

func (handler *PipelineEventsHandler) handleExperienceScreenViewed(event *pipeline.Event) error {
	if event.GetTimestamp() == nil {
		// TODO warn
		return nil
	}

	fields, err := getExperienceFields(event)
	if err != nil {
		return nil
	}

	screenID, ok := event.GetAttributes().GetString("screenID")
	if !ok {
		return nil
	}

	var record = &domain.ExperienceScreenViewedRecord{
		Timestamp:    time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)).UTC(),
		AccountID:    int(event.GetAuthContext().GetAccountId()),
		CampaignID:   fields.campaignID,
		ExperienceID: fields.experienceID,
		ScreenID:     screenID,
		Duration:     fields.duration,
		DeviceID:     event.GetDevice().GetDeviceIdentifier(),
	}

	err = handler.ExperienceInteractor.RecordScreenViewed(record)
	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			return nil
		}
		return err
	}

	return nil
}

func (handler *PipelineEventsHandler) handleExperienceBlockTapped(event *pipeline.Event) error {
	if event.GetTimestamp() == nil {
		// TODO warn
		return nil
	}

	fields, err := getExperienceFields(event)
	if err != nil {
		return nil
	}

	var (
		screenID string
		blockID  string
	)

	screenID, ok := event.GetAttributes().GetString("screenID")
	if !ok {
		return nil
	}

	// BlockID parsing
	blockID, ok = event.GetAttributes().GetString("blockID")
	if !ok {
		return nil
	}

	var record = &domain.ExperienceBlockTappedRecord{
		Timestamp:    time.Unix(event.GetTimestamp().Seconds, int64(event.GetTimestamp().Nanos)).UTC(),
		AccountID:    int(event.GetAuthContext().GetAccountId()),
		CampaignID:   fields.campaignID,
		ExperienceID: fields.experienceID,
		ScreenID:     screenID,
		BlockID:      blockID,
		Duration:     fields.duration,
		DeviceID:     event.GetDevice().GetDeviceIdentifier(),
	}

	err = handler.ExperienceInteractor.RecordBlockTapped(record)
	if err != nil {
		if _, ok := err.(*domain.ErrInvalid); ok {
			return nil
		}
		return err
	}

	return nil
}

// Helpers
type experienceEventFields struct {
	campaignID   *int
	experienceID string
	duration     float64
}

func getExperienceFields(event *pipeline.Event) (*experienceEventFields, error) {
	var (
		campaignID   *int
		experienceID string
		duration     float64
	)

	if campaignIDValue, ok := event.GetAttributes().GetString("campaignID"); ok {
		if id, err := strconv.ParseInt(campaignIDValue, 10, 64); err == nil {
			campaignID = intPtr(int(id))
		}
	}

	experienceID, ok := event.GetAttributes().GetString("experienceID")
	if !ok {
		return nil, errors.New("missing experienceID from attributes")
	}

	duration, ok = event.GetAttributes().GetNumber("duration")
	if !ok {
		return nil, errors.New("missing duration value from attributes")
	}

	return &experienceEventFields{
		campaignID:   campaignID,
		experienceID: experienceID,
		duration:     duration,
	}, nil
}
