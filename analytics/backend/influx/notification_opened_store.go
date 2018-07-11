package influx

// TODO combine notification_opened_store & notification_sent_store

import (
	"encoding/json"
	"fmt"
	"time"

	influx "github.com/influxdata/influxdb/client/v2"
	"github.com/pkg/errors"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
)

var (
	_ usecase.NotificationOpenedStore = (*NotificationOpenedStore)(nil)
)

const notificationOpenedTable = "notification_opened"

type NotificationOpenedStore struct {
	Client *Client
}

func (store *NotificationOpenedStore) Create(records ...*domain.NotificationOpenedRecord) error {
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
			"source":      string(record.Source),
			"sub_source":  string(record.SubSource),
		}

		var fields = map[string]interface{}{
			"device_id": record.DeviceID,
		}

		point, err := influx.NewPoint(notificationOpenedTable, tags, fields, record.Timestamp)
		if err != nil {
			errors.Wrap(err, "influx.NewPoint")
		}

		batch.AddPoint(point)
	}

	return store.Client.Write(batch)
}

func (store *NotificationOpenedStore) GetReport(accountID int, campaignID int) (*domain.NotificationOpenedReport, error) {
	var (
		cmd = fmt.Sprintf(`
			SELECT COUNT(device_id) as total, COUNT(DISTINCT(device_id)) as unique
			FROM %s 
			WHERE account_id='%d' AND campaign_id='%d' 
			GROUP BY source, sub_source`, notificationOpenedTable, accountID, campaignID)

		query = influx.NewQuery(cmd, store.Client.database, "ns")
	)

	results, err := performQuery(store.Client, query)
	if err != nil {
		return nil, err
	}

	if len(results) == 0 || len(results[0].Series) == 0 {
		return nil, domain.ErrNotFound
	}

	var report = &domain.NotificationOpenedReport{
		Total:  0,
		Unique: 0,

		NotificationCenterTotal:  0,
		NotificationCenterUnique: 0,

		PushDirectTotal:  0,
		PushDirectUnique: 0,

		PushInfluencedTotal:  0,
		PushInfluencedUnique: 0,
	}

	for _, row := range results[0].Series {
		var source = domain.NotificationOpenSource(row.Tags["source"])
		total, err := row.Values[0][1].(json.Number).Int64()
		if err != nil {
			return nil, err
		}
		unique, err := row.Values[0][2].(json.Number).Int64()
		if err != nil {
			return nil, err
		}

		switch source {
		case domain.NotificationOpenSource_PUSH:
			var subsource = domain.NotificationOpenSubSource(row.Tags["sub_source"])
			switch subsource {
			case domain.NotificationOpenSubSource_DIRECT:
				report.PushDirectTotal += int(total)
				report.PushDirectUnique += int(unique)
			case domain.NotificationOpenSubSource_INFLUENCED:
				report.PushInfluencedTotal += int(total)
				report.PushInfluencedUnique += int(unique)
			}
		case domain.NotificationOpenSource_NOTIFICATION_CENTER:
			report.NotificationCenterTotal += int(total)
			report.NotificationCenterUnique += int(unique)
		}
	}

	// Now grab the aggregate
	cmd = fmt.Sprintf(`
			SELECT COUNT(device_id) as total, COUNT(DISTINCT(device_id)) as unique
			FROM %s 
			WHERE account_id='%d' AND campaign_id='%d'`, notificationOpenedTable, accountID, campaignID)

	query = influx.NewQuery(cmd, store.Client.database, "ns")

	results, err = performQuery(store.Client, query)
	if err != nil {
		return nil, err
	}

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

	report.Total = int(total)
	report.Unique = int(unique)

	return report, nil

}

// GetReportByDate retrieves a break down of notification opens per day using the range (from,to]
func (store *NotificationOpenedStore) GetReportByDate(accountID int, campaignID int, from time.Time, to time.Time) (*domain.NotificationOpenedByDateReport, error) {
	var (
		zone = from.Location()

		cmd = fmt.Sprintf(`
			SELECT COUNT(device_id) as total
			FROM %s
			WHERE account_id='%d' AND campaign_id='%d' AND time >='%s' AND time <'%s'
			GROUP BY source,sub_source,time(1d) tz('%s')`,
			notificationOpenedTable,
			accountID,
			campaignID,
			from.Format(time.RFC3339),
			to.Format(time.RFC3339),
			zone.String(),
		)

		// NOTE: precision "" defaults to RFC3999 timestamps
		query = influx.NewQuery(cmd, store.Client.database, "")
	)

	results, err := performQuery(store.Client, query)
	if err != nil {
		return nil, err
	}

	var report = &domain.NotificationOpenedByDateReport{
		Reports: make(map[domain.Date]struct {
			NotificationCenter int
			PushDirect         int
			PushInfluenced     int
		}),
	}

	var zero struct {
		NotificationCenter int
		PushDirect         int
		PushInfluenced     int
	}
	// NOTE: since influx will not return 0 values for the range we queried
	// we instead fill in each missing date report with the 0 values
	for i := from; i.Before(to); i = i.AddDate(0, 0, 1) {
		var date = domain.Date(i.Format("2006-01-02"))
		report.Reports[date] = zero
	}

	var addToReport = func(date domain.Date, notificationCenter int, pushDirect int, pushInfluenced int) {
		var previous = report.Reports[date]
		report.Reports[date] = struct {
			NotificationCenter int
			PushDirect         int
			PushInfluenced     int
		}{
			NotificationCenter: previous.NotificationCenter + notificationCenter,
			PushDirect:         previous.PushDirect + pushDirect,
			PushInfluenced:     previous.PushInfluenced + pushInfluenced,
		}
	}

	// Add results to the report
	if len(results) != 0 || len(results[0].Series) != 0 {
		for _, row := range results[0].Series {
			var source = domain.NotificationOpenSource(row.Tags["source"])

			for _, values := range row.Values {
				timestamp, err := time.Parse(time.RFC3339, values[0].(string))
				if err != nil {
					return nil, err
				}

				total, err := values[1].(json.Number).Int64()
				if err != nil {
					return nil, err
				}

				date := domain.Date(timestamp.Format("2006-01-02"))
				switch source {
				case domain.NotificationOpenSource_NOTIFICATION_CENTER:
					addToReport(date, int(total), 0, 0)
				case domain.NotificationOpenSource_PUSH:
					var subsource = domain.NotificationOpenSubSource(row.Tags["sub_source"])
					switch subsource {
					case domain.NotificationOpenSubSource_DIRECT:
						addToReport(date, 0, int(total), 0)
					case domain.NotificationOpenSubSource_INFLUENCED:
						addToReport(date, 0, 0, int(total))
					}
				}
			}
		}
	}

	return report, nil
}
