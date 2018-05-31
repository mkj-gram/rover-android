package locationiq

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"golang.org/x/net/context"
	"golang.org/x/net/context/ctxhttp"
)

// Client used to make requests to the LocationIQ APIs
type Client struct {
	httpClient *http.Client
	apiKey     string
	zoomLevel  int
}

type apiConfig struct {
	host string
	path string
}

// ReverseGeocodeResponse locationIQ response
type ReverseGeocodeResponse struct {
	Name          string `json:"name"`
	CountryCode   string `json:"country_code"`
	Country       string `json:"country"`
	Postcode      string `json:"postcode"`
	State         string `json:"state"`
	StateDistrict string `json:"state_district"`
	County        string `json:"county"`
	Region        string `json:"region"`
	City          string `json:"city"`
	Town          string `json:"town"`
	Village       string `json:"village"`
	Suburb        string `json:"suburb"`
	Hamlet        string `json:"hamlet"`
	Neighbourhood string `json:"neighbourhood"`
	Road          string `json:"road"`
	HouseNumber   string `json:"house_number"`
}

// NewClient constructs a client for reverse geocoding
func NewClient(apiKey string, zoomLevel int) (*Client, error) {
	if apiKey == "" {
		return nil, errors.New("geocodeClient: API Key required")
	}
	return &Client{apiKey: apiKey, zoomLevel: zoomLevel, httpClient: &http.Client{Timeout: time.Second * 10}}, nil
}

func (c *Client) get(ctx context.Context, config *apiConfig, apiReq url.Values) (*http.Response, error) {

	host := config.host

	req, err := http.NewRequest("GET", host+config.path, nil)
	if err != nil {
		return nil, err
	}

	apiReq.Set("key", c.apiKey)
	var query = apiReq.Encode()
	req.URL.RawQuery = query

	return ctxhttp.Do(ctx, c.httpClient, req)
}

func (c *Client) getJSON(ctx context.Context, config *apiConfig, apiReq url.Values, resp interface{}) error {
	httpResp, err := c.get(ctx, config, apiReq)
	if err != nil {
		return err
	}
	defer httpResp.Body.Close()

	return json.NewDecoder(httpResp.Body).Decode(resp)
}

// ReverseGeocode given latitude and longitude returns bounding
func (c *Client) ReverseGeocode(ctx context.Context, latitude float64, longitude float64) (*ReverseGeocodeResponse, error) {

	var reverseGeocodingAPI = &apiConfig{
		host: "https://us1.locationiq.org",
		path: "/v1/reverse.php",
	}

	var response struct {
		Results *ReverseGeocodeResponse `json:"address"`
	}

	request := url.Values{}
	request.Set("format", "json")
	request.Set("zoom", strconv.Itoa(c.zoomLevel))
	request.Set("lat", strconv.FormatFloat(latitude, 'f', -1, 64))
	request.Set("lon", strconv.FormatFloat(longitude, 'f', -1, 64))

	if err := c.getJSON(ctx, reverseGeocodingAPI, request, &response); err != nil {
		return nil, err
	}

	return response.Results, nil
}
