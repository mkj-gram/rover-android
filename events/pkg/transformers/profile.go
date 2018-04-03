package transformers

import (
	"context"

	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/events/pkg/pipeline"
)

func FindProfile(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		var identifier string

		switch input := e.GetInput().GetType().(type) {
		case *event.EventInput_DeviceEventInput:
			identifier = input.DeviceEventInput.GetContext().GetProfileIdentifier()
		case *event.EventInput_ProfileEventInput:
			identifier = input.ProfileEventInput.GetProfileIdentifier()
		default:
			panic("event input was not of type DeviceEventInput or ProfileEventInput")
		}

		// This event doesn't have a profile associated with it move on
		if identifier == "" {
			return nil
		}

		resp, err := client.GetProfile(ctx, &audience.GetProfileRequest{
			AuthContext: e.GetInput().GetAuthContext(),
			Identifier:  identifier,
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.NotFound:
					return nil
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.Unavailable, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "FindProfile"))
				default:
					return errors.Wrap(err, "FindProfile")
				}
			} else {
				return err
			}
		}

		switch e.GetInput().GetType().(type) {
		case *event.EventInput_DeviceEventInput:
			source, ok := e.GetSource().(*event.Event_DeviceSource)
			if !ok {
				return nil
			}

			source.DeviceSource.AssociatedProfile = resp.GetProfile()
		case *event.EventInput_ProfileEventInput:
			source, ok := e.GetSource().(*event.Event_ProfileSource)
			if !ok {
				return nil
			}

			source.ProfileSource.Profile = resp.GetProfile()
		}

		return nil
	})
}
