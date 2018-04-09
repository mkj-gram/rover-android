package grpc

import (
	notification "github.com/roverplatform/rover/apis/go/notification/v1"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) SendCampaignNotification(ctx context.Context, req *notification.SendCampaignNotificationRequest) (*notification.SendCampaignNotificationResponse, error) {
	return nil, status.Error(codes.Unimplemented, "wip")
}
