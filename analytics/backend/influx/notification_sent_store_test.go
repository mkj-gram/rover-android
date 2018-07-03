package influx_test

import (
	"testing"

	db "github.com/influxdata/influxdb/client/v2"
	"github.com/influxdata/influxdb/models"
	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/influx"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestNotificationSentStore_Create(t *testing.T) {

	client := NewClient(t)
	defer client.Close()
	Truncate(t, client, "analytics_test", "notification_sent")

	var (
		store   = influx.NotificationSentStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
		records = []*domain.NotificationSentRecord{
			{
				Timestamp:  timestamp(t, "2018-06-14T02:10:22Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_NOTIFICATION_CENTER,
				Result:     domain.NotificationSentResult_DELIVERED,
				DeviceID:   "f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:  timestamp(t, "2018-06-14T03:08:33Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_DELIVERED,
				DeviceID:   "02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:  timestamp(t, "2018-06-14T03:44:01Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_UNREACHABLE,
				DeviceID:   "078a39be-7242-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:  timestamp(t, "2018-06-14T04:01:00Z", ""),
				AccountID:  1,
				CampaignID: 1,
				Channel:    domain.NotificationSentChannel_PUSH,
				Result:     domain.NotificationSentResult_INVALID,
				DeviceID:   "fcd1b1fe-7bd9-11e8-adc0-fa7ae01bbebc",
			},
		}
	)

	if err := store.Create(records...); err != nil {
		t.Fatal(err)
	}

	res, err := client.Query(db.Query{Command: "SELECT time,account_id,campaign_id,channel,result,device_id FROM notification_sent", Database: "analytics_test"})
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
						Name:    "notification_sent",
						Tags:    nil,
						Columns: []string{"time", "account_id", "campaign_id", "channel", "result", "device_id"},
						Values: [][]interface{}{
							{
								"2018-06-14T02:10:22Z",
								"1",
								"1",
								string(domain.NotificationSentChannel_NOTIFICATION_CENTER),
								string(domain.NotificationSentResult_DELIVERED),
								"f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:08:33Z",
								"1",
								"1",
								string(domain.NotificationSentChannel_PUSH),
								string(domain.NotificationSentResult_DELIVERED),
								"02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:44:01Z",
								"1",
								"1",
								string(domain.NotificationSentChannel_PUSH),
								string(domain.NotificationSentResult_UNREACHABLE),
								"078a39be-7242-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T04:01:00Z",
								"1",
								"1",
								string(domain.NotificationSentChannel_PUSH),
								string(domain.NotificationSentResult_INVALID),
								"fcd1b1fe-7bd9-11e8-adc0-fa7ae01bbebc",
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

func TestNotificationSentStore_GetReport(t *testing.T) {
	client := NewClient(t)
	defer client.Close()

	Truncate(t, client, "analytics_test", "notification_sent")
	Load(
		t,
		client,
		"analytics_test",
		"notification_sent",
		"./testdata/TestNotificationSentStore_GetReport",
	)

	var tests = []struct {
		name string

		accountID  int
		campaignID int

		exp    *domain.NotificationSentReport
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
			exp: &domain.NotificationSentReport{
				TotalDelivered:  5,
				UniqueDelivered: 4,

				NotificationCenterAttempted:   4,
				NotificationCenterDelivered:   4,
				NotificationCenterUnreachable: 0,
				NotificationCenterInvalid:     0,

				PushAttempted:   3,
				PushDelivered:   1,
				PushUnreachable: 1,
				PushInvalid:     1,
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			store := influx.NotificationSentStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
			var got, gotErr = store.GetReport(test.accountID, test.campaignID)
			if diff := rtesting.Diff(test.exp, got, test.expErr, gotErr); diff != nil {
				t.Fatalf("\n%s", rtesting.Difff(diff))
			}
		})
	}
}
