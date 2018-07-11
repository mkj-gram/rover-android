package influx_test

import (
	"testing"

	"encoding/json"

	db "github.com/influxdata/influxdb/client/v2"
	"github.com/influxdata/influxdb/models"
	"github.com/roverplatform/rover/analytics/backend/domain"
	"github.com/roverplatform/rover/analytics/backend/influx"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func intptr(i int) *int {
	return &i
}

func TestExperienceViewedStore_Create(t *testing.T) {
	client := NewClient(t)
	defer client.Close()
	Truncate(t, client, "analytics_test", "experience_viewed")

	var (
		store   = influx.ExperienceViewedStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
		records = []*domain.ExperienceViewedRecord{
			{
				Timestamp:    timestamp(t, "2018-06-14T02:10:22Z", ""),
				AccountID:    1,
				CampaignID:   intptr(1),
				ExperienceID: "5b1b5f880000000000000000",
				Duration:     30.11,
				DeviceID:     "f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:    timestamp(t, "2018-06-14T03:08:33Z", ""),
				AccountID:    1,
				CampaignID:   nil,
				ExperienceID: "5b42ec880000000000000000",
				Duration:     54,
				DeviceID:     "02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:    timestamp(t, "2018-06-14T03:44:01Z", ""),
				AccountID:    1,
				CampaignID:   intptr(1),
				ExperienceID: "5b3836580000000000000000",
				Duration:     2.004,
				DeviceID:     "078a39be-7242-11e8-adc0-fa7ae01bbebc",
			},
		}
	)

	if err := store.Create(records...); err != nil {
		t.Fatal(err)
	}

	res, err := client.Query(db.Query{Command: "SELECT time,account_id,campaign_id,experience_id,duration_seconds,device_id FROM experience_viewed", Database: "analytics_test"})
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
						Name:    "experience_viewed",
						Tags:    nil,
						Columns: []string{"time", "account_id", "campaign_id", "experience_id", "duration_seconds", "device_id"},
						Values: [][]interface{}{
							{
								"2018-06-14T02:10:22Z",
								"1",
								"1",
								"5b1b5f880000000000000000",
								json.Number("30.11"),
								"f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:08:33Z",
								"1",
								nil,
								"5b42ec880000000000000000",
								json.Number("54"),
								"02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:44:01Z",
								"1",
								"1",
								"5b3836580000000000000000",
								json.Number("2.004"),
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

func TestExperienceScreenViewedStore_Create(t *testing.T) {
	client := NewClient(t)
	defer client.Close()
	Truncate(t, client, "analytics_test", "experience_screen_viewed")

	var (
		store   = influx.ExperienceScreenViewedStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
		records = []*domain.ExperienceScreenViewedRecord{
			{
				Timestamp:    timestamp(t, "2018-06-14T02:10:22Z", ""),
				AccountID:    1,
				CampaignID:   intptr(1),
				ExperienceID: "5b1b5f880000000000000000",
				ScreenID:     "d8djak2",
				Duration:     44.1,
				DeviceID:     "f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:    timestamp(t, "2018-06-14T03:08:33Z", ""),
				AccountID:    1,
				CampaignID:   nil,
				ExperienceID: "5b42ec880000000000000000",
				ScreenID:     "dh28s",
				Duration:     25,
				DeviceID:     "02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:    timestamp(t, "2018-06-14T03:44:01Z", ""),
				AccountID:    1,
				CampaignID:   intptr(1),
				ExperienceID: "5b3836580000000000000000",
				ScreenID:     "jhjsd92",
				Duration:     18.23,
				DeviceID:     "078a39be-7242-11e8-adc0-fa7ae01bbebc",
			},
		}
	)

	if err := store.Create(records...); err != nil {
		t.Fatal(err)
	}

	res, err := client.Query(db.Query{Command: "SELECT time,account_id,campaign_id,experience_id,screen_id,duration_seconds,device_id FROM experience_screen_viewed", Database: "analytics_test"})
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
						Name:    "experience_screen_viewed",
						Tags:    nil,
						Columns: []string{"time", "account_id", "campaign_id", "experience_id", "screen_id", "duration_seconds", "device_id"},
						Values: [][]interface{}{
							{
								"2018-06-14T02:10:22Z",
								"1",
								"1",
								"5b1b5f880000000000000000",
								"d8djak2",
								json.Number("44.1"),
								"f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:08:33Z",
								"1",
								nil,
								"5b42ec880000000000000000",
								"dh28s",
								json.Number("25"),
								"02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:44:01Z",
								"1",
								"1",
								"5b3836580000000000000000",
								"jhjsd92",
								json.Number("18.23"),
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

func TestExperienceBlockTappedStore_Create(t *testing.T) {
	client := NewClient(t)
	defer client.Close()
	Truncate(t, client, "analytics_test", "experience_block_tapped")

	var (
		store   = influx.ExperienceBlockTappedStore{Client: influx.NewClientFromHttpClient(client, "analytics_test")}
		records = []*domain.ExperienceBlockTappedRecord{
			{
				Timestamp:    timestamp(t, "2018-06-14T02:10:22Z", ""),
				AccountID:    1,
				CampaignID:   intptr(1),
				ExperienceID: "5b1b5f880000000000000000",
				ScreenID:     "d8djak2",
				BlockID:      "hbaha",
				Duration:     44.1,
				DeviceID:     "f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:    timestamp(t, "2018-06-14T03:08:33Z", ""),
				AccountID:    1,
				CampaignID:   nil,
				ExperienceID: "5b42ec880000000000000000",
				ScreenID:     "dh28s",
				BlockID:      "asjhdhjas",
				Duration:     25,
				DeviceID:     "02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
			},
			{
				Timestamp:    timestamp(t, "2018-06-14T03:44:01Z", ""),
				AccountID:    1,
				CampaignID:   intptr(1),
				ExperienceID: "5b3836580000000000000000",
				ScreenID:     "jhjsd92",
				BlockID:      "dskb23",
				Duration:     18.23,
				DeviceID:     "078a39be-7242-11e8-adc0-fa7ae01bbebc",
			},
		}
	)

	if err := store.Create(records...); err != nil {
		t.Fatal(err)
	}

	res, err := client.Query(db.Query{Command: "SELECT time,account_id,campaign_id,experience_id,screen_id,block_id,duration_seconds,device_id FROM experience_block_tapped", Database: "analytics_test"})
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
						Name:    "experience_block_tapped",
						Tags:    nil,
						Columns: []string{"time", "account_id", "campaign_id", "experience_id", "screen_id", "block_id", "duration_seconds", "device_id"},
						Values: [][]interface{}{
							{
								"2018-06-14T02:10:22Z",
								"1",
								"1",
								"5b1b5f880000000000000000",
								"d8djak2",
								"hbaha",
								json.Number("44.1"),
								"f3c9e1b8-7241-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:08:33Z",
								"1",
								nil,
								"5b42ec880000000000000000",
								"dh28s",
								"asjhdhjas",
								json.Number("25"),
								"02c5fa9e-7242-11e8-adc0-fa7ae01bbebc",
							},
							{
								"2018-06-14T03:44:01Z",
								"1",
								"1",
								"5b3836580000000000000000",
								"jhjsd92",
								"dskb23",
								json.Number("18.23"),
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
