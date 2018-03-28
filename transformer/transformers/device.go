package transformers

import (
	"context"
	"fmt"
	"reflect"

	"github.com/pkg/errors"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/apis/go/protobuf"
	"github.com/roverplatform/rover/apis/go/protobuf/struct"
	"github.com/roverplatform/rover/transformer/pipeline"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const roverEventNamespace = "rover"
const locationUpdateEventName = "Location Update"

func isDeviceInput(input *event.EventInput) bool {
	_, ok := input.GetType().(*event.EventInput_DeviceEventInput)
	return ok
}

func FindDevice(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		var deviceId = e.GetInput().GetDeviceEventInput().GetDeviceId()

		if deviceId == "" {
			return errors.New("DeviceID cannot be blank")
		}

		resp, err := client.GetDevice(ctx, &audience.GetDeviceRequest{
			AuthContext: e.GetInput().GetAuthContext(),
			DeviceId:    deviceId,
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.NotFound:
					return nil
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.Unavailable, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "FindDevice"))
				default:
					return errors.Wrap(err, "FindDevice")
				}
			} else {
				return err
			}
		}

		source := e.Source.(*event.Event_DeviceSource).DeviceSource

		source.Device = resp.GetDevice()

		return nil
	})
}

func FindProfileDevices(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		input, ok := e.GetInput().GetType().(*event.EventInput_ProfileEventInput)
		if !ok {
			return nil
		}

		var identifier = input.ProfileEventInput.GetProfileIdentifier()
		if identifier == "" {
			return nil
		}

		resp, err := client.ListDevicesByProfileIdentifier(ctx, &audience.ListDevicesByProfileIdentifierRequest{
			AuthContext:       e.GetInput().GetAuthContext(),
			ProfileIdentifier: identifier,
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.NotFound:
					return nil
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.Unavailable, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "FindProfileDevices"))
				default:
					return errors.Wrap(err, "FindProfileDevices")
				}
			} else {
				return err
			}
		}

		source, ok := e.GetSource().(*event.Event_ProfileSource)
		if !ok {
			return nil
		}

		source.ProfileSource.AssociatedDevices = resp.GetDevices()

		return nil
	})
}

// Create a device if no device in audience exists. This only runs when the input type is of device
func CreateDevice(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		// This event is not a device input so we can just skip over
		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		// If the source already specifies a device then we can continue
		if e.GetDeviceSource().GetDevice() != nil {
			return nil
		}

		// Assume we don't have a device in our system when we get here
		// we will try to create one and if it already exists we can re-run the FindTransformer
		// Note resp is meaningless
		resp, err := client.CreateDevice(ctx, &audience.CreateDeviceRequest{
			AuthContext:       e.Input.GetAuthContext(),
			DeviceId:          e.Input.GetDeviceEventInput().GetDeviceId(),
			ProfileIdentifier: e.Input.GetDeviceEventInput().GetContext().GetProfileIdentifier(),
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.Canceled, codes.AlreadyExists, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "CreateDevice"))
				default:
					return errors.Wrap(err, "CreateDevice")
				}
			}
			return nil
		}

		e.Source = &event.Event_DeviceSource{
			DeviceSource: &event.DeviceSource{
				Device: resp.GetDevice(),
			},
		}

		return nil
	})
}

func SetDeviceProfile(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		source, ok := e.Source.(*event.Event_DeviceSource)
		if !ok {
			return nil
		}

		var (
			device = source.DeviceSource.GetDevice()
			dctx   = e.GetInput().GetDeviceEventInput().GetContext()
		)

		// if the device is missing or the context is nil just move on
		if device == nil || dctx == nil {
			return nil
		}

		if dctx.GetProfileIdentifier() == device.GetProfileIdentifier() {
			return nil
		}

		_, err := client.SetDeviceProfileIdentifier(ctx, &audience.SetDeviceProfileIdentifierRequest{
			AuthContext:       e.GetInput().GetAuthContext(),
			DeviceId:          device.GetDeviceId(),
			ProfileIdentifier: dctx.GetProfileIdentifier(),
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "SetDeviceProfile"))
				default:
					return errors.Wrap(err, "SetDeviceProfile")
				}
			}
			return nil
		}

		e.GetDeviceSource().GetDevice().ProfileIdentifier = dctx.GetProfileIdentifier()

		return nil
	})
}

func toAudienceFrameworks(m map[string]*rover_protobuf.Version) map[string]*audience.Version {

	var mapped = map[string]*audience.Version{}

	for k, v := range m {
		mapped[k] = versionForAudience(v)
	}

	return mapped
}

// Update the device based on context
func UpdateDeviceWithContext(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		source, ok := e.Source.(*event.Event_DeviceSource)
		if !ok {
			return nil
		}

		var (
			device = source.DeviceSource.GetDevice()
			dctx   = e.GetInput().GetDeviceEventInput().GetContext()
		)

		// check if any attributes are not equivalent
		if device == nil || dctx == nil {
			return nil
		}

		// TODO check if we need to actually update the device or not

		resp, err := client.UpdateDevice(ctx, &audience.UpdateDeviceRequest{
			AuthContext: e.GetInput().GetAuthContext(),
			DeviceId:    e.GetInput().GetDeviceEventInput().GetDeviceId(),

			PushEnvironment:    dctx.GetPushEnvironment(),
			PushTokenKey:       dctx.GetPushToken(),
			AppName:            dctx.GetAppName(),
			AppVersion:         dctx.GetAppVersion(),
			AppBuild:           dctx.GetAppBuild(),
			AppNamespace:       dctx.GetAppNamespace(),
			DeviceManufacturer: dctx.GetDeviceManufacturer(),
			OsName:             dctx.GetOperatingSystemName(),
			OsVersion:          versionForAudience(dctx.GetOperatingSystemVersion()),

			// TODO map this device model to human readable
			DeviceModel:                 dctx.GetDeviceModel(),
			DeviceModelRaw:              dctx.GetDeviceModel(),
			Frameworks:                  toAudienceFrameworks(dctx.GetFrameworks()),
			LocaleLanguage:              dctx.GetLocaleLanguage(),
			LocaleRegion:                dctx.GetLocaleRegion(),
			LocaleScript:                dctx.GetLocaleScript(),
			IsWifiEnabled:               dctx.GetIsWifiEnabled(),
			IsCellularEnabled:           dctx.GetIsCellularEnabled(),
			ScreenWidth:                 dctx.GetScreenWidth(),
			ScreenHeight:                dctx.GetScreenHeight(),
			CarrierName:                 dctx.GetCarrierName(),
			Radio:                       dctx.GetRadio(),
			TimeZone:                    dctx.GetTimeZone(),
			Platform:                    audience.Platform_MOBILE,
			IsBackgroundEnabled:         false,
			IsLocationMonitoringEnabled: dctx.GetIsLocationServicesEnabled().GetValue(),
			IsBluetoothEnabled:          dctx.GetIsBluetoothEnabled(),
			AdvertisingId:               dctx.GetAdvertisingId(),
			Ip:                          dctx.GetIp(),
			NotificationAuthorization: dctx.GetNotificationAuthorization(),
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "UpdateDeviceWithContext"))
				default:
					return errors.Wrap(err, "UpdateDeviceWithContext")
				}
			}
			return nil
		}

		e.GetDeviceSource().Device = resp.GetDevice()

		return nil
	})
}

func UpdateDeviceCustomAttributes(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		source, ok := e.Source.(*event.Event_DeviceSource)
		if !ok {
			return nil
		}

		var (
			device = source.DeviceSource.GetDevice()
			dctx   = e.GetInput().GetDeviceEventInput().GetContext()
		)

		if device == nil || dctx == nil {
			return nil
		}

		update := map[string]*audience.Value{}

		convert := func(value *structpb.Value) (*audience.Value, error) {
			switch v := value.Kind.(type) {
			case *structpb.Value_NullValue:
				return audience.NullVal, nil
			case *structpb.Value_NumberValue:
				return audience.DoubleVal(v.NumberValue), nil
			case *structpb.Value_StringValue:
				return audience.StringVal(v.StringValue), nil
			case *structpb.Value_BoolValue:
				return audience.BoolVal(v.BoolValue), nil
			case *structpb.Value_StructValue:
				// audience does not support
				return nil, errors.New("StructValue is not supported in audience")
			case *structpb.Value_ListValue:
				// make sure this is a list of strings
				var strings []string
				for _, lv := range v.ListValue.Values {
					if s, ok := lv.Kind.(*structpb.Value_StringValue); ok {
						strings = append(strings, s.StringValue)
					}
				}

				if len(strings) > 0 {
					return audience.StringArrayVal(strings...), nil
				} else {
					return nil, errors.New("ListValue has no string values")
				}
			default:
				return nil, fmt.Errorf("no mapping exists for (%T)", v)
			}
		}

		for key, value := range dctx.GetAttributes().GetFields() {
			if v, err := convert(value); err == nil {
				update[key] = v
			}
		}

		if reflect.DeepEqual(update, device.GetAttributes()) {
			return nil
		}
		_, err := client.UpdateDeviceCustomAttributes(ctx, &audience.UpdateDeviceCustomAttributesRequest{
			AuthContext: e.GetInput().GetAuthContext(),
			DeviceId:    e.GetInput().GetDeviceEventInput().GetDeviceId(),
			Attributes:  update,
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "UpdateDeviceCustomAttributes"))
				default:
					return errors.Wrap(err, "UpdateDeviceCustomAttributes")
				}
			}
			return nil
		}

		source.DeviceSource.Device.Attributes = update

		return nil
	})
}

func UpdateDeviceLocation(audienceClient audience.AudienceClient, geocoderClient geocoder.GeocoderClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		// Only process event if its a rover location update event
		if e.GetInput().GetNamespace() != roverEventNamespace || e.GetInput().GetName() != locationUpdateEventName {
			return nil
		}

		source, ok := e.Source.(*event.Event_DeviceSource)
		if !ok {
			return nil
		}

		var (
			device = source.DeviceSource.GetDevice()
			dctx   = e.GetInput().GetDeviceEventInput().GetContext()
		)

		if device == nil || dctx == nil {
			return nil
		}

		var (
			attributes = e.GetInput().GetAttributes().GetFields()
			lat        = 0.0
			lng        = 0.0
			accuracy   = 0.0
		)

		if value, ok := attributes["latitude"].Kind.(*structpb.Value_NumberValue); ok {
			lat = value.NumberValue
		}

		if value, ok := attributes["longitude"].Kind.(*structpb.Value_NumberValue); ok {
			lng = value.NumberValue
		}

		if value, ok := attributes["accuracy"].Kind.(*structpb.Value_NumberValue); ok {
			accuracy = value.NumberValue
		}

		var updateRequest = &audience.UpdateDeviceLocationRequest{
			AuthContext:       e.GetInput().GetAuthContext(),
			DeviceId:          device.GetDeviceId(),
			LocationLongitude: lng,
			LocationLatitude:  lat,
			LocationAccuracy:  int32(accuracy),
		}

		// First lets reverse geocode the request
		geocodedLocation, err := geocoderClient.ReverseGeocode(ctx, &geocoder.ReverseGeocodeRequest{
			Latitude:  lat,
			Longitude: lng,
			Accuracy:  accuracy,
		})

		// If there is no error in reverse geocoding we can append the results to the device update request
		if err == nil {
			updateRequest.LocationCountry = geocodedLocation.GetCountry()
			updateRequest.LocationState = geocodedLocation.GetState()
			updateRequest.LocationCity = geocodedLocation.GetCity()
		}

		_, err = audienceClient.UpdateDeviceLocation(ctx, updateRequest)
		if err != nil {
			// we couldn't update the device location just move on
			return nil
		}

		// Mutate the device
		device.LocationLatitude = updateRequest.LocationLatitude
		device.LocationLongitude = updateRequest.LocationLongitude
		device.LocationAccuracy = updateRequest.LocationAccuracy
		device.LocationCountry = updateRequest.LocationCountry
		device.LocationState = updateRequest.LocationState
		device.LocationCity = updateRequest.LocationCity

		return nil
	})
}

func UpdateDeviceName(client audience.AudienceClient) pipeline.Handler {
	return pipeline.HandlerFunc(func(ctx context.Context, e *event.Event) error {

		if !isDeviceInput(e.GetInput()) {
			return nil
		}

		source, ok := e.Source.(*event.Event_DeviceSource)
		if !ok {
			return nil
		}

		var (
			device = source.DeviceSource.GetDevice()
			dctx   = e.GetInput().GetDeviceEventInput().GetContext()
		)

		// check if any attributes are not equivalent
		if device == nil || dctx == nil {
			return nil
		}

		if device.GetLabel() == dctx.GetDeviceName() {
			return nil
		}

		_, err := client.UpdateDeviceLabelProperty(ctx, &audience.UpdateDeviceLabelPropertyRequest{
			AuthContext: e.GetInput().GetAuthContext(),
			DeviceId:    device.GetDeviceId(),
			Label:       dctx.GetDeviceName(),
		})

		if err != nil {
			if st, ok := status.FromError(err); ok {
				switch st.Code() {
				case codes.Canceled, codes.Unknown, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Aborted, codes.Internal, codes.DataLoss:
					return pipeline.NewRetryableError(errors.Wrap(err, "UpdateDeviceLabelProperty"))
				default:
					return errors.Wrap(err, "UpdateDeviceLabelProperty")
				}
			}
			return nil
		}

		device.Label = dctx.GetDeviceName()

		return nil
	})
}

func versionForAudience(v *rover_protobuf.Version) *audience.Version {
	if v == nil {
		return nil
	}

	return &audience.Version{
		Major:    v.Major,
		Minor:    v.Minor,
		Revision: v.Revision,
	}
}
