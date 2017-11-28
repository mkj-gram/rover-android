package service

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"googlemaps.github.io/maps"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service/cache"
)

var (
	_ geocoder.GeocoderServer = (*Server)(nil)
)

type MapsClient interface {
	ReverseGeocode(ctx context.Context, request *maps.GeocodingRequest) ([]maps.GeocodingResult, error)
}

type Server struct {
	Client MapsClient
	Cache  *cache.Store
}

func (s *Server) ReverseGeocode(ctx context.Context, req *geocoder.ReverseGeocodeRequest) (*geocoder.ReverseGeocodeResponse, error) {

	response, err := s.Cache.GetReverseGeocodeResponse(req)
	if response != nil && err == nil {
		return response, nil
	}

	result, err := s.Client.ReverseGeocode(ctx, &maps.GeocodingRequest{
		LatLng: &maps.LatLng{
			Lat: req.GetLatitude(),
			Lng: req.GetLongitude(),
		},
	})

	if err != nil {
		return nil, status.Error(codes.Unknown, err.Error())
	}

	response = &geocoder.ReverseGeocodeResponse{
		Country: getCountry(result[0]),
		State:   getState(result[0]),
		City:    getCity(result[0]),
	}

	err = s.Cache.CacheReverseGeocodeResponse(req, response, 0)
	if err != nil {
		// TODO log? we don't really care about errors until we have monitoring
	}

	return response, nil
}

func getComponentByType(result maps.GeocodingResult, ctype string) *maps.AddressComponent {
	for _, component := range result.AddressComponents {
		for _, t := range component.Types {
			if t == ctype {
				return &component
			}
		}
	}
	return nil
}

func getCountry(result maps.GeocodingResult) string {
	component := getComponentByType(result, "country")
	if component == nil {
		return ""
	}

	return component.LongName
}

func getState(result maps.GeocodingResult) string {
	component := getComponentByType(result, "administrative_area_level_1")
	if component == nil {
		return ""
	}

	return component.LongName
}

func getCity(result maps.GeocodingResult) string {
	component := getComponentByType(result, "locality")
	if component == nil {
		return ""
	}

	return component.LongName
}
