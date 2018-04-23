package grpc

import (
	"context"
	"github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/notification/postgres"
	"github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
)

var _ notification.NotificationServer = (*Server)(nil)

type Server struct {
	PlatformServer
	NotificationServer
}

type PlatformServer struct {
	DB *postgres.DB
}

/*
	NotificationServer configuration
*/

type NotificationSettingsStore interface {
	OneById(ctx context.Context, campaignId int32) (*scylla.NotificationSettings, error)
	Create(ctx context.Context, settings scylla.NotificationSettings) error
}

type NotificationStore interface {
	List(ctx context.Context, accountID int32, deviceID string) ([]*scylla.Notification, error)
}

type Publisher interface {
	Publish(ctx context.Context, messages ...pubsub.Message) []error
}

type NotificationServer struct {
	DB interface {
		NotificationSettingsStore() NotificationSettingsStore
		NotificationStore() NotificationStore
	}

	Publisher Publisher
}
