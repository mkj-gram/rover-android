package transformers

import (
	"context"

	"github.com/pkg/errors"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/events/pkg/pipeline"
)

func Root(audienceClient audience.AudienceClient, geocoderClient geocoder.GeocoderClient) pipeline.Handler {

	var (
		deviceInputChain = pipeline.NewChain("DeviceInputChain").
					Then(FindDevice(audienceClient)).
					Then(CreateDevice(audienceClient)).
					Then(UpdateDeviceWithContext(audienceClient)).
					Then(UpdateDeviceCustomAttributes(audienceClient)).
					Then(UpdateDeviceLocation(audienceClient, geocoderClient)).
					Then(UpdateDeviceName(audienceClient)).
					Then(FindProfile(audienceClient))

		profileInputChain = pipeline.NewChain("ProfileInputChain").
					Then(FindProfile(audienceClient)).
					Then(FindProfileDevices(audienceClient))
	)

	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if e.GetInput() == nil {
			return errors.New("Cannot process an empty event")
		}

		var chain pipeline.Handler

		switch in := e.GetInput().GetType().(type) {
		case *event.EventInput_DeviceEventInput:
			e.Source = &event.Event_DeviceSource{DeviceSource: &event.DeviceSource{}}
			chain = deviceInputChain
		case *event.EventInput_ProfileEventInput:
			e.Source = &event.Event_ProfileSource{ProfileSource: &event.ProfileSource{}}
			chain = profileInputChain
		default:
			return errors.Errorf("Unrecognized event input type (%T) %v", in, in)

		}

		return chain.Handle(ctx, e)
	})
}
