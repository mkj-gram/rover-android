package influx

import (
	"fmt"
	"net/url"
	"time"

	influx "github.com/influxdata/influxdb/client/v2"
)

type Client struct {
	influx.Client
	database string
}

func NewClient(dsn string) (*Client, error) {
	config, db, err := parseDsn(dsn)
	if err != nil {
		return nil, err
	}

	client, err := influx.NewHTTPClient(config)
	if err != nil {
		return nil, err
	}
	return &Client{
		Client:   client,
		database: db,
	}, nil
}

func NewClientFromHttpClient(client influx.Client, database string) *Client {
	return &Client{Client: client, database: database}
}

func (c *Client) Ping(timeout time.Duration) error {
	_, _, err := c.Client.Ping(timeout)
	return err
}

func parseDsn(dsn string) (influx.HTTPConfig, string, error) {
	URL, err := url.Parse(dsn)
	if err != nil {
		return influx.HTTPConfig{}, "", err
	}

	config := influx.HTTPConfig{
		Addr: fmt.Sprintf("%s://%s", URL.Scheme, URL.Host),
	}

	if URL.User != nil {
		config.Username = URL.User.Username()
		if password, ok := URL.User.Password(); ok {
			config.Password = password
		}
	}

	var db = ""
	if URL.Path != "" {
		db = URL.Path[1:]
	}

	return config, db, nil
}
