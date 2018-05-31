package locationiq

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/namsral/flag"
	rtesting "github.com/roverplatform/rover/go/testing"
)

var (
	api  = flag.String("locationiq-api-key", "", "api key")
	zoom = flag.Int("locationiq-zoom-level", 10, "zoom level")
)

func init() {
	flag.Parse()
	if *api == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}
}
func TestClient_ReverseGeocode(t *testing.T) {

	var ctx = context.Background()

	client, err := NewClient(*api, *zoom)
	if err != nil {
		t.Fatal(err)
	}

	type req struct {
		latitude  float64
		longitude float64
	}

	var tests = []struct {
		name string
		req  req

		exp    *ReverseGeocodeResponse
		expErr error
	}{
		{
			name: "Given Downtown Toronto lat/log returns valid reverse geocode",
			req: req{
				latitude:  43.6507328,
				longitude: -79.3761292,
			},
			exp: &ReverseGeocodeResponse{
				Name:          "",
				CountryCode:   "ca",
				Country:       "Canada",
				Postcode:      "",
				State:         "Ontario",
				StateDistrict: "",
				County:        "",
				Region:        "",
				City:          "Toronto",
				Town:          "",
				Village:       "",
				Suburb:        "",
				Hamlet:        "",
				Neighbourhood: "",
				Road:          "",
				HouseNumber:   "",
			},
		},
		{
			name: "Given rural USA lat/log returns valid reverse geocode",
			req: req{
				latitude:  39.037842,
				longitude: -115.537396,
			},
			exp: &ReverseGeocodeResponse{
				Name:          "",
				CountryCode:   "us",
				Country:       "United States of America",
				Postcode:      "",
				State:         "Nevada",
				StateDistrict: "",
				County:        "White Pine County",
				Region:        "",
				City:          "",
				Town:          "",
				Village:       "",
				Suburb:        "",
				Hamlet:        "",
				Neighbourhood: "",
				Road:          "",
				HouseNumber:   "",
			},
		},
		{
			name: "Given USA Charlotte lat/log returns valid reverse geocode",
			req: req{
				latitude:  35.104502,
				longitude: -80.829007,
			},
			exp: &ReverseGeocodeResponse{
				Name:          "",
				CountryCode:   "us",
				Country:       "United States of America",
				Postcode:      "",
				State:         "North Carolina",
				StateDistrict: "",
				County:        "Mecklenburg County",
				Region:        "",
				City:          "Charlotte",
				Town:          "",
				Village:       "",
				Suburb:        "",
				Hamlet:        "",
				Neighbourhood: "",
				Road:          "",
				HouseNumber:   "",
			},
		},
		{
			name: "Given invalid lat/log returns nil",
			req: req{
				latitude:  1337,
				longitude: -115.537396,
			},
			exp: nil,
			expErr: nil,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var got, gotErr = client.ReverseGeocode(ctx, test.req.latitude, test.req.longitude)
			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Errorf("\nDiff: \n%v\n", rtesting.Difff(diff))
			}
		})
		time.Sleep(1 * time.Second) // must sleep to avoid free test account tier 1req/sec rate limit
	}
}
