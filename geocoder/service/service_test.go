package service

import (
	"encoding/json"
	"io/ioutil"
	"reflect"
	"testing"

	"golang.org/x/net/context"
	"googlemaps.github.io/maps"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
)

type MapsClientMock struct {
	Result []maps.GeocodingResult
	Error  error
}

func (m *MapsClientMock) ReverseGeocode(ctx context.Context, request *maps.GeocodingRequest) ([]maps.GeocodingResult, error) {
	return m.Result, m.Error
}

func TestServer_ReverseGeocode(t *testing.T) {
	type fields struct {
		Client MapsClient
	}
	type args struct {
		req *geocoder.ReverseGeocodeRequest
	}
	tests := []struct {
		name    string
		client  MapsClient
		want    *geocoder.ReverseGeocodeResponse
		wantErr bool
	}{
		{
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.01.json"), Error: nil},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "Canada",
				State:   "Ontario",
				City:    "Toronto",
			},
		},
		{
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.02.json"), Error: nil},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "Germany",
				State:   "Hessen",
				City:    "Offenbach am Main",
			},
		},
		{
			client: &MapsClientMock{Result: loadReverseGeocodeResponse(t, "./testdata/response.03.json"), Error: nil},
			want: &geocoder.ReverseGeocodeResponse{
				Country: "China",
				State:   "Gansu Sheng",
				City:    "Jiuquan Shi",
			},
		},
	}

	for _, tt := range tests {
		ctx := context.Background()
		t.Run(tt.name, func(t *testing.T) {
			s := &Server{
				Client: tt.client,
			}
			got, err := s.ReverseGeocode(ctx, nil)
			if (err != nil) != tt.wantErr {
				t.Errorf("Server.ReverseGeocode() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Server.ReverseGeocode() = %v, want %v", got, tt.want)
			}
		})
	}
}

/*
func Test_getComponentByType(t *testing.T) {
	type args struct {
		result maps.GeocodingResult
		ctype  string
	}

	tests := []struct {
		name string
		args args
		want *maps.AddressComponent
	}{
		{
			name: "does stuff",
			args: struct {
				result maps.GeocodingResult
				ctype  string
			}{
				result: loadReverseGeocodeResponse(t, "./testdata/response.01.json")[0],
				ctype:  "administrative_area_level_1",
			},
			want: &maps.AddressComponent{
				LongName:  "Ontario",
				ShortName: "ON",
				Types:     []string{"administrative_area_level_1", "political"},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getComponentByType(tt.args.result, tt.args.ctype); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getComponentByType() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getCountry(t *testing.T) {
	type args struct {
		result maps.GeocodingResult
	}
	tests := []struct {
		name string
		args args
		want string
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getCountry(tt.args.result); got != tt.want {
				t.Errorf("getCountry() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getState(t *testing.T) {
	type args struct {
		result maps.GeocodingResult
	}
	tests := []struct {
		name string
		args args
		want string
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getState(tt.args.result); got != tt.want {
				t.Errorf("getState() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getCity(t *testing.T) {
	type args struct {
		result maps.GeocodingResult
	}
	tests := []struct {
		name string
		args args
		want string
	}{
	// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getCity(tt.args.result); got != tt.want {
				t.Errorf("getCity() = %v, want %v", got, tt.want)
			}
		})
	}
}
*/

func loadReverseGeocodeResponse(t *testing.T, file string) []maps.GeocodingResult {
	raw, err := ioutil.ReadFile(file)
	if err != nil {
		t.Error(err)
	}

	var result []maps.GeocodingResult

	json.Unmarshal(raw, &result)

	return result
}
