package transformers

import (
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/events/backend/pipeline"
)

func Root(audienceClient audience.AudienceClient, geocoderClient geocoder.GeocoderClient, deviceModelNameMapper func(string) string) pipeline.Handler {
	var deviceInputChain = pipeline.NewChain("DeviceInputChain").
		Then(FindDevice(audienceClient)).
		Then(CreateDevice(audienceClient)).
		Then(UpdateDeviceWithContext(audienceClient, deviceModelNameMapper)).
		Then(UpdateDeviceCustomAttributes(audienceClient)).
		Then(UpdateDeviceLocation(audienceClient, geocoderClient)).
		Then(UpdateDeviceName(audienceClient)).
		Then(UpdateDeviceTestStatus(audienceClient))

	return deviceInputChain
}
