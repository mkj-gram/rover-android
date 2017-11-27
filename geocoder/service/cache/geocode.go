package cache

import (
	"time"

	"github.com/go-redis/redis"
	"github.com/golang/protobuf/proto"
	"github.com/mmcloughlin/geohash"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
)

func getReverseGeocodeCacheKey(req *geocoder.ReverseGeocodeRequest) string {
	var (
		lat = req.GetLatitude()
		lng = req.GetLongitude()
		// Chars 6 is geohash box of (1.22km, 0.61km)(w,h)
		key = geohash.EncodeWithPrecision(lat, lng, 6)
	)

	return key
}
func (s *Store) GetReverseGeocodeResponse(req *geocoder.ReverseGeocodeRequest) (*geocoder.ReverseGeocodeResponse, error) {

	data, err := s.Client.Get(getReverseGeocodeCacheKey(req)).Result()
	if err == redis.Nil {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	var response geocoder.ReverseGeocodeResponse
	err = proto.Unmarshal([]byte(data), &response)
	if err != nil {
		return nil, err
	}

	return &response, nil
}

func (s *Store) CacheReverseGeocodeResponse(req *geocoder.ReverseGeocodeRequest, response *geocoder.ReverseGeocodeResponse, expires time.Duration) error {
	var key = getReverseGeocodeCacheKey(req)
	data, err := proto.Marshal(response)
	if err != nil {
		return err
	}

	err = s.Client.Set(key, data, expires).Err()
	if err != nil {
		return err
	}

	return nil
}
