package usecase

import (
	"time"

	"github.com/roverplatform/rover/analytics/backend/domain"
)

type NotificationOpenedStore interface {
	Create(records ...*domain.NotificationOpenedRecord) error
	GetReport(accountID int, campaignID int) (*domain.NotificationOpenedReport, error)
	GetReportByDate(accountID int, campaignID int, from time.Time, to time.Time) (*domain.NotificationOpenedByDateReport, error)
}

type NotificationSentStore interface {
	Create(records ...*domain.NotificationSentRecord) error
	GetReport(accountID int, campaignID int) (*domain.NotificationSentReport, error)
}

type NotificationsInteractor struct {
	SentStore   NotificationSentStore
	OpenedStore NotificationOpenedStore
}

func (interactor *NotificationsInteractor) RecordSent(records ...*domain.NotificationSentRecord) error {
	if records == nil {
		return nil
	}

	for _, record := range records {
		if ok, err := record.IsValid(); !ok {
			return err
		}
	}

	return interactor.SentStore.Create(records...)
}

func (interactor *NotificationsInteractor) RecordOpened(records ...*domain.NotificationOpenedRecord) error {
	if records == nil {
		return nil
	}

	for _, record := range records {
		if ok, err := record.IsValid(); !ok {
			return err
		}
	}

	return interactor.OpenedStore.Create(records...)
}

func (interactor *NotificationsInteractor) GetOpenedReport(accountID int, campaignID int) (*domain.NotificationOpenedReport, error) {
	if accountID == 0 {
		return nil, domain.NewInvalidError("accountID", "is required")
	}

	if campaignID == 0 {
		return nil, domain.NewInvalidError("campaignID", "is required")
	}

	return interactor.OpenedStore.GetReport(accountID, campaignID)
}

func (interactor *NotificationsInteractor) GetOpenedReportByDate(accountID int, campaignID int, from time.Time, to time.Time) (*domain.NotificationOpenedByDateReport, error) {
	if accountID == 0 {
		return nil, domain.NewInvalidError("accountID", "is required")
	}

	if campaignID == 0 {
		return nil, domain.NewInvalidError("campaignID", "is required")
	}

	if from.IsZero() {
		return nil, domain.NewInvalidError("from", "is required")
	}

	if to.IsZero() {
		return nil, domain.NewInvalidError("to", "is required")
	}

	if from.After(to) {
		return nil, domain.NewInvalidError("from", "cannot be after to")
	}

	var (
		fromZone = from.Location()
		toZone   = to.Location()
	)

	if fromZone != toZone {
		return nil, domain.NewInvalidError("from", "timezone must be the same as to timezone")
	}

	// there can only be a maximum of 31 days you are allowed to grab the report by
	if to.Sub(from) > time.Hour*24*31 {
		return nil, domain.NewInvalidError("from", "can only query a 31 day range")
	}

	return interactor.OpenedStore.GetReportByDate(accountID, campaignID, from, to)
}

func (interactor *NotificationsInteractor) GetSentReport(accountID int, campaignID int) (*domain.NotificationSentReport, error) {
	if accountID == 0 {
		return nil, domain.NewInvalidError("accountID", "is required")
	}

	if campaignID == 0 {
		return nil, domain.NewInvalidError("campaignID", "is required")
	}

	return interactor.SentStore.GetReport(accountID, campaignID)
}
