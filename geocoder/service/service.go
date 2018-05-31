package service

import (
	"strings"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service/cache"
	"github.com/roverplatform/rover/geocoder/service/locationiq"
)

var (
	_ geocoder.GeocoderServer = (*Server)(nil)
)

// LocationIQClient interfaces with LocationIQ to reverse geocode
type LocationIQClient interface {
	ReverseGeocode(ctx context.Context, latitude float64, longitude float64) (*locationiq.ReverseGeocodeResponse, error)
}

// Server ...
type Server struct {
	Client LocationIQClient
	Cache  *cache.Store
}

// ReverseGeocode given latitude & longitude returns reverse geocode
func (s *Server) ReverseGeocode(ctx context.Context, req *geocoder.ReverseGeocodeRequest) (*geocoder.ReverseGeocodeResponse, error) {

	response, err := s.Cache.GetReverseGeocodeResponse(req)
	if response != nil && err == nil {
		return response, nil
	}

	results, err := s.Client.ReverseGeocode(ctx, req.GetLatitude(), req.GetLongitude())

	if err != nil {
		return nil, status.Error(codes.Unknown, err.Error())
	}

	if results == nil {
		return nil, status.Error(codes.FailedPrecondition, "No ReverseGeocode result")
	}

	response = &geocoder.ReverseGeocodeResponse{
		Country: getCountry(results),
		State:   getState(results),
		City:    getCity(results),
	}

	err = s.Cache.CacheReverseGeocodeResponse(req, response, 0)
	if err != nil {
		// TODO log? we don't really care about errors until we have monitoring
	}

	return response, nil
}

func getCountry(results *locationiq.ReverseGeocodeResponse) string {
	countyCode := results.CountryCode
	if countyCode != "" {
		return strings.ToUpper(countyCode)
	}
	return ""
}

func getState(results *locationiq.ReverseGeocodeResponse) string {
	state := results.State
	if state != "" {
		return state
	}
	return ""
}

func getCity(results *locationiq.ReverseGeocodeResponse) string {
	city := results.City
	if city != "" {
		return city
	}	

	hamlet := results.Hamlet
	if hamlet != "" {
		return hamlet
	}

	village := results.Village
	if village != "" {
		return village
	}

	town := results.Town
	if town != "" {
		return town
	}

	county := results.County
	if county != "" {
		return county
	}

	district := results.StateDistrict
	if district != "" {
		return district
	}
	return ""
}
