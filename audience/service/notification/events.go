package notification

import (
	"context"

	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"

	audiencepb "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	notification_events "github.com/roverplatform/rover/apis/go/notification/v1/events"
	"github.com/roverplatform/rover/audience/service/grpc"
	"github.com/roverplatform/rover/audience/service/kafka"
	"github.com/roverplatform/rover/go/retry"
)

var (
	MaxAttempts = 10
)

type ()

type (
	EventsHandler struct {
		audiencepb.AudienceClient
	}

	HandlerResponse struct {
		Attempts int
		Message  proto.Message
	}
)

func (handler *EventsHandler) Handle(ctx context.Context, msg *kafka.Message) (*HandlerResponse, error) {
	if msg == nil {
		return nil, nil
	}

	var (
		resp  HandlerResponse
		event notification_events.Event
	)

	if err := proto.Unmarshal(msg.Value, &event); err != nil {
		// ignore
		return nil, nil
	}

	resp.Message = &event

	var (
		permissionScopes = []string{"server", "audience"}

		backoff = retry.Backoff{
			MaxAttempts: MaxAttempts,
		}
	)

	return &resp, func() error {
		switch event := event.Type.(type) {
		case nil:
			return nil
		case *notification_events.Event_PushNotificationSent:
			var e = event.PushNotificationSent
			if e == nil {
				// Discard
				return nil
			}

			var err error
			if ok := backoff.Do(ctx, func() (retry bool) {
				resp.Attempts += 1

				req := &audiencepb.UpdateDeviceAppBadgeNumberRequest{
					AuthContext: &auth.AuthContext{
						AccountId:        e.AccountId,
						PermissionScopes: permissionScopes,
					},
					DeviceId:       e.DeviceId,
					AppBadgeNumber: e.BadgeNumber,
				}

				_, err = handler.AudienceClient.UpdateDeviceAppBadgeNumber(ctx, req)
				if err != nil {
					return grpc.IsRetryableError(errors.Cause(err))
				}
				return false
			}); !ok {
				err = errors.Wrap(err, "backoff")
			}
			return errors.Wrap(err, "badger.UpdateDeviceAppBadgeNumber")
		default:
			return nil
		}
	}()
}
