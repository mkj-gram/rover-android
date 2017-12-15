package service

import (
	"sort"

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

// Precision levels of GeocodingResults
const (
	APPROXIMATE = iota
	GEOMETRIC_CENTER
	RANGE_INTERPOLATED
	ROOFTOP
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

	results, err := s.Client.ReverseGeocode(ctx, &maps.GeocodingRequest{
		LatLng: &maps.LatLng{
			Lat: req.GetLatitude(),
			Lng: req.GetLongitude(),
		},
	})

	if err != nil {
		return nil, status.Error(codes.Unknown, err.Error())
	}

	if len(results) == 0 {
		return nil, status.Error(codes.FailedPrecondition, "No results")
	}

	// Ensure that the result set is sorted from most precise to least
	sort.Slice(results, func(i, j int) bool {
		return getPrecisionLevel(results[i]) > getPrecisionLevel(results[j])
	})

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

func getPrecisionLevel(result maps.GeocodingResult) int {
	switch result.Geometry.LocationType {
	case "APPROXIMATE":
		return APPROXIMATE
	case "GEOMETRIC_CENTER":
		return GEOMETRIC_CENTER
	case "RANGE_INTERPOLATED":
		return RANGE_INTERPOLATED
	case "ROOFTOP":
		return ROOFTOP
	default:
		return APPROXIMATE
	}
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

func getCountry(results []maps.GeocodingResult) string {

	for _, result := range results {
		component := getComponentByType(result, "country")
		if component != nil {
			return component.LongName
		}
	}

	return ""
}

func getState(results []maps.GeocodingResult) string {

	for _, result := range results {
		component := getComponentByType(result, "administrative_area_level_1")
		if component != nil {
			return component.LongName
		}
	}

	for _, result := range results {
		component := getComponentByType(result, "administrative_area_level_2")
		if component != nil {
			return component.LongName
		}
	}

	return ""
}

func getCity(results []maps.GeocodingResult) string {

	for _, result := range results {
		component := getComponentByType(result, "locality")
		if component != nil {
			return component.LongName
		}
	}

	return ""
}
