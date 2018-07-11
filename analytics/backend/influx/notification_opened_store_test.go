package influx_test

import (
	"fmt"
	"testing"
	"time"

	db "github.com/influxdata/influxdb/client/v2"
	"github.com/influxdata/influxdb/models"
	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/influx"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestNotificationOpenedStore_Create(t *testing.T) {

	client := NewClient(t)
	defer client.Close()
	Truncate(t, client, "analytics_test", "notification_opened")

	var (
		store   = influx.NotificationOpenedStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
		records = []*domain.NotificationOpenedRecord{
			{
				Timestamp:  timestamp(t, "2018-06-14T02:10:22Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Source:     domain.NotificationOpenSource_PUSH,
				SubSource:  domain.NotificationOpenSubSource_DIRECT,
				DeviceID:   "f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:  timestamp(t, "2018-06-14T03:08:33Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Source:     domain.NotificationOpenSource_PUSH,
				SubSource:  domain.NotificationOpenSubSource_INFLUENCED,
				DeviceID:   "02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:  timestamp(t, "2018-06-14T03:44:01Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Source:     domain.NotificationOpenSource_NOTIFICATION_CENTER,
				SubSource:  domain.NotificationOpenSubSource_NONE,
				DeviceID:   "078a39be-7242-11e8-adc0-fa7ae01bbebc",
			},
		}
	)

	if err := store.Create(records...); err != nil {
		t.Fatal(err)
	}

	res, err := client.Query(db.Query{Command: "SELECT time,account_id,campaign_id,source,sub_source,device_id FROM notification_opened", Database: "analytics_test"})
	if err != nil {
		t.Fatal(err)
	}
	if res.Error() != nil {
		t.Fatal(res.Error())
	}

	var (
		got    = res.Results
		expect = []db.Result{
			{
				Series: []models.Row{
					{
						Name:    "notification_opened",
						Tags:    nil,
						Columns: []string{"time", "account_id", "campaign_id", "source", "sub_source", "device_id"},
						Values: [][]interface{}{
							{
								"2018-06-14T02:10:22Z",
								"1",
								"1",
								string(domain.NotificationOpenSource_PUSH),
								string(domain.NotificationOpenSubSource_DIRECT),
								"f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:08:33Z",
								"1",
								"1",
								string(domain.NotificationOpenSource_PUSH),
								string(domain.NotificationOpenSubSource_INFLUENCED),
								"02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:44:01Z",
								"1",
								"1",
								string(domain.NotificationOpenSource_NOTIFICATION_CENTER),
								nil,
								"078a39be-7242-11e8-adc0-fa7ae01bbebc",
							},
						},
					},
				},
			},
		}
	)

	if diff := rtesting.Diff(expect, got, nil, nil); diff != nil {
		t.Fatalf("\n%s", rtesting.Difff(diff))
	}
}

func TestNotificationOpenedStore_GetReport(t *testing.T) {
	client := NewClient(t)
	defer client.Close()

	Truncate(t, client, "analytics_test", "notification_opened")
	Load(
		t,
		client,
		"analytics_test",
		"notification_opened",
		"./testdata/TestNotificationOpenedStore_GetReport",
	)

	var tests = []struct {
		name string

		accountID  int
		campaignID int

		exp    *domain.NotificationOpenedReport
		expErr error
	}{
		{
			name:       "returns not found when results are empty",
			accountID:  0,
			campaignID: 0,
			expErr:     domain.ErrNotFound,
		},
		{
			name:       "returns report",
			accountID:  1,
			campaignID: 1,
			exp: &domain.NotificationOpenedReport{
				Total:                    14,
				Unique:                   13,
				NotificationCenterTotal:  7,
				NotificationCenterUnique: 6,
				PushDirectTotal:          4,
				PushDirectUnique:         4,

				PushInfluencedTotal:  3,
				PushInfluencedUnique: 3,
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			store := influx.NotificationOpenedStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
			var got, gotErr = store.GetReport(test.accountID, test.campaignID)
			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatalf("\n%s", rtesting.Difff(diff))
			}
		})
	}
}

func TestNotificationOpenedStore_GetReportByDate(t *testing.T) {
	client := NewClient(t)
	defer client.Close()

	Truncate(t, client, "analytics_test", "notification_opened")
	Load(
		t,
		client,
		"analytics_test",
		"notification_opened",
		"./testdata/TestNotificationOpenedStore_GetReportByDate",
	)

	type request struct {
		accountID  int
		campaignID int
		from       time.Time
		to         time.Time
	}

	var tests = []struct {
		name string

		request request

		exp    *domain.NotificationOpenedByDateReport
		expErr error
	}{
		{
			name: "returns 0 values for entire time range",
			request: request{
				accountID:  44,
				campaignID: 1,
				from:       timestamp(t, "2018-06-14T00:00:00Z", ""),
				to:         timestamp(t, "2018-06-17T00:00:00Z", ""),
			},
			exp: &domain.NotificationOpenedByDateReport{
				Reports: map[domain.Date]struct {
					NotificationCenter int
					PushDirect         int
					PushInfluenced     int
				}{
					"2018-06-14": {
						PushInfluenced:     0,
						PushDirect:         0,
						NotificationCenter: 0,
					},
					"2018-06-15": {
						PushInfluenced:     0,
						PushDirect:         0,
						NotificationCenter: 0,
					},
					"2018-06-16": {
						PushInfluenced:     0,
						PushDirect:         0,
						NotificationCenter: 0,
					},
				},
			},
		},
		{
			name: "counts totals",
			request: request{
				accountID:  1,
				campaignID: 1,
				from:       timestamp(t, "2018-06-14T00:00:00Z", ""),
				to:         timestamp(t, "2018-06-20T00:00:00Z", ""),
			},
			exp: &domain.NotificationOpenedByDateReport{
				Reports: map[domain.Date]struct {
					NotificationCenter int
					PushDirect         int
					PushInfluenced     int
				}{
					"2018-06-14": {
						PushInfluenced:     1,
						PushDirect:         2,
						NotificationCenter: 0,
					},
					"2018-06-15": {
						PushInfluenced:     2,
						PushDirect:         1,
						NotificationCenter: 0,
					},
					"2018-06-16": {
						PushInfluenced:     0,
						PushDirect:         2,
						NotificationCenter: 0,
					},
					"2018-06-17": {
						PushInfluenced:     0,
						PushDirect:         1,
						NotificationCenter: 1,
					},
					"2018-06-18": {
						PushInfluenced:     0,
						PushDirect:         0,
						NotificationCenter: 1,
					},
					"2018-06-19": {
						PushInfluenced:     0,
						PushDirect:         1,
						NotificationCenter: 0,
					},
				},
			},
		},
		{
			name: "preserves timezone",
			request: request{
				accountID:  1,
				campaignID: 1,
				from:       timestamp(t, "2018-06-13T00:00:00-04:00", "America/Toronto"),
				to:         timestamp(t, "2018-06-14T00:00:00-04:00", "America/Toronto"),
			},
			exp: &domain.NotificationOpenedByDateReport{
				Reports: map[domain.Date]struct {
					NotificationCenter int
					PushDirect         int
					PushInfluenced     int
				}{
					"2018-06-13": {
						PushInfluenced:     0,
						PushDirect:         2,
						NotificationCenter: 0,
					},
				},
			},
		},
		{
			name: "filters out by date",
			request: request{
				accountID:  1,
				campaignID: 1,
				from:       timestamp(t, "2018-06-14T00:00:00Z", ""),
				to:         timestamp(t, "2018-06-15T00:00:00Z", ""),
			},
			exp: &domain.NotificationOpenedByDateReport{
				Reports: map[domain.Date]struct {
					NotificationCenter int
					PushDirect         int
					PushInfluenced     int
				}{
					"2018-06-14": {
						PushInfluenced:     1,
						PushDirect:         2,
						NotificationCenter: 0,
					},
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			store := influx.NotificationOpenedStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
			var got, gotErr = store.GetReportByDate(test.request.accountID, test.request.campaignID, test.request.from, test.request.to)
			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatal(fmt.Sprintf("\n%s", rtesting.Difff(diff)))
			}
		})
	}
}

func timestamp(t *testing.T, in string, zone string) time.Time {
	t.Helper()

	var loc = time.UTC
	if zone != "" {
		var err error
		loc, err = time.LoadLocation(zone)
		if err != nil {
			t.Fatal(err)
		}

	}
	tstamp, err := time.ParseInLocation(time.RFC3339, in, loc)
	if err != nil {
		t.Fatal(err)
	}

	if tstamp.Location().String() == "" {
		t.Fatal("Timezone does not match timestamp offset")
	}

	return tstamp
}
