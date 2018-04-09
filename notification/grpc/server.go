package grpc

import (
	"github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/notification/postgres"
)

var _ notification.NotificationServer = (*Server)(nil)

type Server struct {
	DB *postgres.DB
}
