package middleware

import (
	"context"
	"fmt"
	"path"
	"time"

	"github.com/karlseguin/ccache"
	"google.golang.org/grpc"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

const audienceService = "rover.audience.v1.Audience"

var TimeNow = func() *timestamp.Timestamp {
	now, _ := timestamp.TimestampProto(time.Now())
	return now
}

func NewCache(size int64) *ccache.Cache {
	return ccache.New(ccache.Configure().MaxSize(size).GetsPerPromote(5))
}

func NewAudienceClientMiddleware(cache *ccache.Cache, profileRefreshTime time.Duration) grpc.UnaryClientInterceptor {

	return func(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {

		var service = path.Dir(method)[1:]

		if service != audienceService {
			return invoker(ctx, method, req, reply, cc, opts...)
		}

		switch r := req.(type) {
		case *audience.GetDeviceRequest:
			ret, ok := reply.(*audience.GetDeviceResponse)
			if !ok {
				return invoker(ctx, method, req, reply, cc, opts...)
			}

			var (
				key  = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
				item = cache.Get(key)
			)

			if item != nil {
				if device, ok := item.Value().(*audience.Device); ok {
					ret.Device = device
					return nil
				}
			}

			// nothing in cache
			err := invoker(ctx, method, req, reply, cc, opts...)
			if err != nil {
				return err
			}

			// capture the device to cache
			cache.Set(key, ret.GetDevice(), 0)
			return nil
		case *audience.UpdateDeviceRequest:
			// updates the device and returns what the device looks like
			var (
				key = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			)

			err := invoker(ctx, method, req, reply, cc, opts...)
			if err != nil {
				cache.Delete(key)
				return err
			}

			response, ok := reply.(*audience.UpdateDeviceResponse)
			if !ok {
				return nil
			}

			cache.Replace(key, response.GetDevice())
			return nil
		case *audience.UpdateDeviceCustomAttributesRequest:
			// updates the custom attribute

			err := invoker(ctx, method, req, reply, cc, opts...)
			key := getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			if err != nil {
				// to be safe we just invalidate the cache
				cache.Delete(key)
				return err
			}

			item := cache.Get(key)
			if item == nil {
				return nil
			}

			if device, ok := item.Value().(*audience.Device); ok {
				device.Attributes = r.GetAttributes()
				device.UpdatedAt = TimeNow()
			}

			return nil

		case *audience.UpdateDevicePushTokenRequest:
			// invalidate everything for simplicity
			var (
				key = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			)
			cache.Delete(key)
			return invoker(ctx, method, req, reply, cc, opts...)
		case *audience.UpdateDeviceUnregisterPushTokenRequest:
			// invalidate everything for simplicity
			var (
				key = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			)
			cache.Delete(key)
			return invoker(ctx, method, req, reply, cc, opts...)
		case *audience.UpdateDeviceLocationRequest:
			err := invoker(ctx, method, req, reply, cc, opts...)
			key := getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			if err != nil {
				// to be safe we just invalidate the cache
				cache.Delete(key)
				return err
			}

			item := cache.Get(key)
			if item == nil {
				return nil
			}

			if device, ok := item.Value().(*audience.Device); ok {
				device.LocationLongitude = r.GetLocationLongitude()
				device.LocationLatitude = r.GetLocationLatitude()
				device.LocationAccuracy = r.GetLocationAccuracy()
				device.LocationCountry = r.GetLocationCountry()
				device.LocationState = r.GetLocationState()
				device.LocationCity = r.GetLocationCity()
				device.UpdatedAt = TimeNow()
			}

			return nil

		case *audience.UpdateDeviceLabelPropertyRequest:
			err := invoker(ctx, method, req, reply, cc, opts...)
			key := getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			if err != nil {
				// to be safe we just invalidate the cache
				cache.Delete(key)
				return err
			}

			item := cache.Get(key)
			if item == nil {
				return nil
			}

			if device, ok := item.Value().(*audience.Device); ok {
				device.Label = r.GetLabel()
				device.UpdatedAt = TimeNow()
			}

			return nil

		case *audience.UpdateDeviceGeofenceMonitoringRequest:
			// invalidate everything for simplicity
			var (
				key = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			)
			cache.Delete(key)
			return invoker(ctx, method, req, reply, cc, opts...)
		case *audience.UpdateDeviceIBeaconMonitoringRequest:
			// invalidate everything for simplicity
			var (
				key = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			)
			cache.Delete(key)
			return invoker(ctx, method, req, reply, cc, opts...)
		case *audience.SetDeviceProfileIdentifierRequest:
			// invalidate everything for simplicity
			var (
				key = getDeviceCacheKey(r.GetAuthContext().GetAccountId(), r.GetDeviceId())
			)

			err := invoker(ctx, method, req, reply, cc, opts...)
			if err != nil {
				cache.Delete(key)
				return err
			}

			item := cache.Get(key)
			if item == nil {
				return nil
			}

			if device, ok := item.Value().(*audience.Device); ok {
				device.ProfileIdentifier = r.GetProfileIdentifier()
				device.UpdatedAt = TimeNow()
			}

			return nil

		// Profiles
		case *audience.GetProfileRequest:
			ret, ok := reply.(*audience.GetProfileResponse)
			if !ok {
				return invoker(ctx, method, req, reply, cc, opts...)
			}

			var (
				key  = getProfileCacheKey(r.GetAuthContext().GetAccountId(), r.GetIdentifier())
				item = cache.Get(key)
			)

			if item != nil && !item.Expired() {
				if profile, ok := item.Value().(*audience.Profile); ok {
					ret.Profile = profile
					return nil
				}
			}

			// nothing in cache
			err := invoker(ctx, method, req, reply, cc, opts...)
			if err != nil {
				return err
			}

			// capture the profile to cache
			cache.Set(key, ret.GetProfile(), profileRefreshTime)
			return nil

		default:
			return invoker(ctx, method, req, reply, cc, opts...)
		}
	}
}

func getDeviceCacheKey(accountId int32, deviceId string) string {
	return fmt.Sprintf("device:%d:%s", accountId, deviceId)
}

func getProfileCacheKey(accountId int32, profileIdentifier string) string {
	return fmt.Sprintf("profile:%d:%s", accountId, profileIdentifier)
}
