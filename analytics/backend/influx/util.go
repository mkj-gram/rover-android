package influx

import (
	influx "github.com/influxdata/influxdb/client/v2"
)

func performQuery(client *Client, query influx.Query) ([]influx.Result, error) {
	res, err := client.Query(query)
	if err != nil {
		return nil, err
	}
	if res.Error() != nil {
		return nil, err
	}
	return res.Results, nil
}
