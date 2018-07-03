package influx

import (
	"encoding/json"
	"fmt"

	influx "github.com/influxdata/influxdb/client/v2"
	"github.com/pkg/errors"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
)

var (
	_ usecase.NotificationSentStore = (*NotificationSentStore)(nil)
)

const notificationSentTable = "notification_sent"

type NotificationSentStore struct {
	Client *Client
}

func (store *NotificationSentStore) Create(records ...*domain.NotificationSentRecord) error {
	batch, err := influx.NewBatchPoints(influx.BatchPointsConfig{
		Precision: "ns",
		Database:  store.Client.database,
	})
	if err != nil {
		return errors.Wrap(err, "influx.NewBatchPoints")
	}

	for _, record := range records {
		var tags = map[string]string{
			"account_id":  fmt.Sprintf("%d", record.AccountID),
			"campaign_id": fmt.Sprintf("%d", record.CampaignID),
			"channel":     string(record.Channel),
			"result":      string(record.Result),
		}

		var fields = map[string]interface{}{
			"device_id": record.DeviceID,
		}

		point, err := influx.NewPoint(notificationSentTable, tags, fields, record.Timestamp)
		if err != nil {
			errors.Wrap(err, "influx.NewPoint")
		}

		batch.AddPoint(point)
	}

	return store.Client.Write(batch)
}

func (store *NotificationSentStore) GetReport(accountID int, campaignID int) (*domain.NotificationSentReport, error) {
	var (
		cmd = fmt.Sprintf(`
			SELECT COUNT(device_id) as total
			FROM %s 
			WHERE account_id='%d' AND campaign_id='%d' 
			GROUP BY channel, result`, notificationSentTable, accountID, campaignID)

		query = influx.NewQuery(cmd, store.Client.database, "")
	)

	results, err := performQuery(store.Client, query)
	if err != nil {
		return nil, err
	}

	if len(results) == 0 || len(results[0].Series) == 0 {
		return nil, domain.ErrNotFound
	}

	var report = &domain.NotificationSentReport{
		TotalDelivered:  0,
		UniqueDelivered: 0,

		NotificationCenterAttempted:   0,
		NotificationCenterDelivered:   0,
		NotificationCenterUnreachable: 0,
		NotificationCenterInvalid:     0,

		PushAttempted:   0,
		PushDelivered:   0,
		PushUnreachable: 0,
		PushInvalid:     0,
	}

	for _, row := range results[0].Series {

		var (
			channel = domain.NotificationSentChannel(row.Tags["channel"])
			result  = domain.NotificationSentResult(row.Tags["result"])
		)

		value, err := row.Values[0][1].(json.Number).Int64()
		if err != nil {
			return nil, err
		}

		var total = int(value)

		switch channel {
		case domain.NotificationSentChannel_NOTIFICATION_CENTER:
			report.NotificationCenterAttempted += total

			switch result {
			case domain.NotificationSentResult_DELIVERED:
				report.NotificationCenterDelivered += total
			case domain.NotificationSentResult_UNREACHABLE:
				report.NotificationCenterUnreachable += total
			case domain.NotificationSentResult_INVALID:
				report.NotificationCenterInvalid += total
			}
		case domain.NotificationSentChannel_PUSH:
			report.PushAttempted += total

			switch result {
			case domain.NotificationSentResult_DELIVERED:
				report.PushDelivered += total
			case domain.NotificationSentResult_UNREACHABLE:
				report.PushUnreachable += total
			case domain.NotificationSentResult_INVALID:
				report.PushInvalid += total
			}
		}
	}

	// Now grab the aggregate
	cmd = fmt.Sprintf(`
			SELECT COUNT(device_id) as total, COUNT(DISTINCT(device_id)) as unique
			FROM %s 
			WHERE account_id='%d' AND campaign_id='%d' AND result='%s'`, notificationSentTable, accountID, campaignID, domain.NotificationSentResult_DELIVERED)

	query = influx.NewQuery(cmd, store.Client.database, "")

	results, err = performQuery(store.Client, query)
	if err != nil {
		return nil, err
	}

	/*
		Example Response from influx
		[
			{
				"Series": [
					{
						"name": "notification_sent",
						"columns": [
							"time",
							"total",
							"unique"
						],
						"values": [
							[
								"1970-01-01T00:00:00Z",
								5,
								4
							]
						]
					}
				]
			}
		]
	*/
	if len(results) == 0 ||
		len(results[0].Series) == 0 ||
		len(results[0].Series[0].Values) == 0 ||
		len(results[0].Series[0].Values[0]) != 3 {
		return nil, errors.Wrap(domain.ErrNotFound, "aggregate query")
	}

	total, err := results[0].Series[0].Values[0][1].(json.Number).Int64()
	if err != nil {
		return nil, errors.Wrap(err, "aggregate parse total")
	}

	unique, err := results[0].Series[0].Values[0][2].(json.Number).Int64()
	if err != nil {
		return nil, errors.Wrap(err, "aggregate parse unique")
	}

	report.TotalDelivered = int(total)
	report.UniqueDelivered = int(unique)

	return report, nil
}
