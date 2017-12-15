package service

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"testing"

	"github.com/go-redis/redis"
	"golang.org/x/net/context"
	"googlemaps.github.io/maps"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service/cache"
	rtesting "github.com/roverplatform/rover/go/testing"
)

type MapsClientMock struct {
	Result []maps.GeocodingResult
	Error  error
}

func (m *MapsClientMock) ReverseGeocode(ctx context.Context, request *maps.GeocodingRequest) ([]maps.GeocodingResult, error) {
	return m.Result, m.Error
}

func TestServer_ReverseGeocode(t *testing.T) {

	redis := redis.NewClient(&redis.Options{
		Addr: "redis:6379",
		DB:   8,
	})
	err := redis.FlushDB().Err()
	if err != nil {
		t.Fatal(err)
	}
	cache := &cache.Store{Client: redis}

	tests := []struct {
		name     string
		onBefore func()
		client   MapsClient
		req      *geocoder.ReverseGeocodeRequest
		want     *geocoder.ReverseGeocodeResponse
	}{
		{
			name:   "Loads and parses /testdata/response.01.json",
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.01.json"), Error: nil},
			req: &geocoder.ReverseGeocodeRequest{
				Latitude:  43.6507328,
				Longitude: -79.3761292,
			},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "Canada",
				State:   "Ontario",
				City:    "Toronto",
			},
		},
		{
			name:   "Loads and parses /testdata/response.02.json",
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.02.json"), Error: nil},
			req: &geocoder.ReverseGeocodeRequest{
				Latitude:  50.10228739999999,
				Longitude: 8.7591725,
			},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "Germany",
				State:   "Hessen",
				City:    "Offenbach am Main",
			},
		},
		{
			name:   "Loads and parses /testdata/response.03.json",
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.03.json"), Error: nil},
			req: &geocoder.ReverseGeocodeRequest{
				Latitude:  41.47641300000001,
				Longitude: 95.33326799999999,
			},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "China",
				State:   "Gansu Sheng",
				City:    "Jiuquan Shi",
			},
		},
		{
			name:   "Loads and parses /testdata/response.04.json",
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.04.json"), Error: nil},
			req: &geocoder.ReverseGeocodeRequest{
				Latitude:  39.037842,
				Longitude: -115.537396,
			},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "United States",
				State:   "Nevada",
				City:    "",
			},
		},
		{
			name: "Returns cached property",
			onBefore: func() {
				cache.CacheReverseGeocodeResponse(&geocoder.ReverseGeocodeRequest{
					Latitude:  100,
					Longitude: -23.22,
				}, &geocoder.ReverseGeocodeResponse{
					Country: "Samsung",
					State:   "Brooklin",
					City:    "Random String",
				}, 0)
			},
			client: &MapsClientMock{Result: nil, Error: errors.New("Value Not From Cache")},
			req: &geocoder.ReverseGeocodeRequest{
				Latitude:  100,
				Longitude: -23.22,
			},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "Samsung",
				State:   "Brooklin",
				City:    "Random String",
			},
		},
	}

	for _, tt := range tests {
		ctx := context.Background()
		t.Run(tt.name, func(t *testing.T) {
			s := &Server{
				Client: tt.client,
				Cache:  cache,
			}
			if tt.onBefore != nil {
				tt.onBefore()
			}
			got, err := s.ReverseGeocode(ctx, tt.req)
			if diff := rtesting.Diff(tt.want, got, nil, err); diff != nil {
				t.Error(diff)
			}

		})
	}
}

func loadReverseGeocodeResponse(t *testing.T, file string) []maps.GeocodingResult {
	raw, err := ioutil.ReadFile(file)
	if err != nil {
		t.Error(err)
	}

	var result []maps.GeocodingResult

	json.Unmarshal(raw, &result)

	return result
}
