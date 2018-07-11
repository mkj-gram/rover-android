package influx

import (
	"fmt"

	influx "github.com/influxdata/influxdb/client/v2"
	"github.com/pkg/errors"

	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/usecase"
)

const (
	experienceViewedTable       = "experience_viewed"
	experienceScreenViewedTable = "experience_screen_viewed"
	experienceBlockTappedTable  = "experience_block_tapped"
)

//
// Experience Viewed
//

var _ usecase.ExperienceViewedStore = (*ExperienceViewedStore)(nil)

type ExperienceViewedStore struct {
	Client *Client
}

func (store *ExperienceViewedStore) Create(records ...*domain.ExperienceViewedRecord) error {
	batch, err := influx.NewBatchPoints(influx.BatchPointsConfig{
		Precision: "ns",
		Database:  store.Client.database,
	})
	if err != nil {
		return errors.Wrap(err, "influx.NewBatchPoints")
	}

	for _, record := range records {
		var tags = map[string]string{
			"account_id":    fmt.Sprintf("%d", record.AccountID),
			"experience_id": record.ExperienceID,
		}

		if record.CampaignID != nil {
			tags["campaign_id"] = fmt.Sprintf("%d", *record.CampaignID)
		}

		var fields = map[string]interface{}{
			"device_id":        record.DeviceID,
			"duration_seconds": record.Duration,
		}

		point, err := influx.NewPoint(experienceViewedTable, tags, fields, record.Timestamp)
		if err != nil {
			errors.Wrap(err, "influx.NewPoint")
		}

		batch.AddPoint(point)
	}

	return store.Client.Write(batch)
}

//
// Experience Screen Viewed
//
var _ usecase.ExperienceScreenViewedStore = (*ExperienceScreenViewedStore)(nil)

type ExperienceScreenViewedStore struct {
	Client *Client
}

func (store *ExperienceScreenViewedStore) Create(records ...*domain.ExperienceScreenViewedRecord) error {
	batch, err := influx.NewBatchPoints(influx.BatchPointsConfig{
		Precision: "ns",
		Database:  store.Client.database,
	})
	if err != nil {
		return errors.Wrap(err, "influx.NewBatchPoints")
	}

	for _, record := range records {
		var tags = map[string]string{
			"account_id":    fmt.Sprintf("%d", record.AccountID),
			"experience_id": record.ExperienceID,
			"screen_id":     record.ScreenID,
		}

		if record.CampaignID != nil {
			tags["campaign_id"] = fmt.Sprintf("%d", *record.CampaignID)
		}

		var fields = map[string]interface{}{
			"device_id":        record.DeviceID,
			"duration_seconds": record.Duration,
		}

		point, err := influx.NewPoint(experienceScreenViewedTable, tags, fields, record.Timestamp)
		if err != nil {
			errors.Wrap(err, "influx.NewPoint")
		}

		batch.AddPoint(point)
	}

	return store.Client.Write(batch)
}

//
// Experience Block Tapped
//
var _ usecase.ExperienceBlockTappedStore = (*ExperienceBlockTappedStore)(nil)

type ExperienceBlockTappedStore struct {
	Client *Client
}

func (store *ExperienceBlockTappedStore) Create(records ...*domain.ExperienceBlockTappedRecord) error {
	batch, err := influx.NewBatchPoints(influx.BatchPointsConfig{
		Precision: "ns",
		Database:  store.Client.database,
	})
	if err != nil {
		return errors.Wrap(err, "influx.NewBatchPoints")
	}

	for _, record := range records {
		var tags = map[string]string{
			"account_id":    fmt.Sprintf("%d", record.AccountID),
			"experience_id": record.ExperienceID,
			"screen_id":     record.ScreenID,
			"block_id":      record.BlockID,
		}

		if record.CampaignID != nil {
			tags["campaign_id"] = fmt.Sprintf("%d", *record.CampaignID)
		}

		var fields = map[string]interface{}{
			"device_id":        record.DeviceID,
			"duration_seconds": record.Duration,
		}

		point, err := influx.NewPoint(experienceBlockTappedTable, tags, fields, record.Timestamp)
		if err != nil {
			errors.Wrap(err, "influx.NewPoint")
		}

		batch.AddPoint(point)
	}

	return store.Client.Write(batch)
}
