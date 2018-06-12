package usecase

import (
	"context"

	"github.com/roverplatform/rover/analytics/backend/domain"
)

type NotificationStore interface {
	SaveSent(ctx context.Context, records ...*domain.NotificationSentRecord) error
	SaveOpened(ctx context.Context, records ...*domain.NotificationOpenedRecord) error
}

type NotificationsInteractor struct {
	Store NotificationStore
}

func (interactor *NotificationsInteractor) RecordSent(ctx context.Context, records ...*domain.NotificationSentRecord) error {
	// TODO check if they are valid
	return interactor.Store.SaveSent(ctx, records...)
}

func (interactor *NotificationsInteractor) RecordOpened(ctx context.Context, records ...*domain.NotificationOpenedRecord) error {
	// TODO check if they are valid
	return interactor.Store.SaveOpened(ctx, records...)
}
