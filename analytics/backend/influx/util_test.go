package influx_test

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	influx "github.com/influxdata/influxdb/client/v2"
	"github.com/namsral/flag"
)

var (
	testDSN = flag.String("test-influxdb-dsn", "", "test database dsn")
)

func init() {
	flag.Parse()
	if *testDSN == "" {
		fmt.Println("test-influxdb-dsn missing")
		os.Exit(1)
	}
}

func NewClient(t *testing.T) influx.Client {
	client, err := influx.NewHTTPClient(influx.HTTPConfig{
		Addr: *testDSN,
	})
	if err != nil {
		t.Fatal(err)
	}
	return client
}

func Truncate(t *testing.T, client influx.Client, db string, measurement string) {
	query := influx.Query{
		Command:  fmt.Sprintf("DROP MEASUREMENT %s", measurement),
		Database: db,
	}
	response, err := client.Query(query)
	if err != nil {
		t.Fatal(err)
	}
	if response.Error() != nil {
		t.Fatal(response.Error())
	}
}

func Load(t *testing.T, client influx.Client, db string, measurement string, file string) {
	f, err := os.Open(file)
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()

	batch, err := influx.NewBatchPoints(influx.BatchPointsConfig{
		Database:  db,
		Precision: "ms",
	})
	if err != nil {
		t.Fatal(err)
	}

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		var data = strings.Split(scanner.Text(), " ")
		var time, err = time.Parse(time.RFC3339, data[0])
		if err != nil {
			t.Fatal(err)
		}
		var tags = map[string]string{}
		for _, tag := range strings.Split(data[1], ",") {
			var parts = strings.Split(tag, "=")
			tags[parts[0]] = parts[1]
		}

		var fields = map[string]interface{}{}
		for _, field := range strings.Split(data[2], ",") {
			var parts = strings.Split(field, "=")
			if strings.HasPrefix(parts[1], `"`) && strings.HasSuffix(parts[1], `"`) {
				fields[parts[0]] = parts[1]
			} else if v, err := strconv.ParseBool(parts[1]); err == nil {
				fields[parts[0]] = v
			} else if v, err := strconv.ParseInt(parts[1], 10, 0); err == nil {
				fields[parts[0]] = v
			} else if v, err := strconv.ParseFloat(parts[1], 0); err == nil {
				fields[parts[0]] = v
			} else {
				t.Fatalf("unable to get type for key(%s) %q", parts[0], parts[1])
			}
		}

		point, err := influx.NewPoint(measurement, tags, fields, time)
		if err != nil {
			t.Fatal(err)
		}
		batch.AddPoint(point)
	}

	if err := client.Write(batch); err != nil {
		t.Fatal(err)
	}
}
