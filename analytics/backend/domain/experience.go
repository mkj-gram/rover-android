package domain

import "time"

type ExperienceViewedRecord struct {
	Timestamp    time.Time
	AccountID    int
	CampaignID   *int // optional
	ExperienceID string

	// number of seconds
	Duration float64
	DeviceID string
}

func (record *ExperienceViewedRecord) IsValid() (bool, error) {
	if record.AccountID == 0 {
		return false, NewInvalidError("AccountID", "is required")
	}

	if record.ExperienceID == "" {
		return false, NewInvalidError("ExperienceID", "is required")
	}

	if record.CampaignID != nil && *record.CampaignID == 0 {
		return false, NewInvalidError("CampaignID", "is required")
	}

	if record.Duration == 0 {
		return false, NewInvalidError("Duration", "is required")
	}

	if record.DeviceID == "" {
		return false, NewInvalidError("DeviceID", "is required")
	}

	return true, nil
}

type ExperienceScreenViewedRecord struct {
	Timestamp    time.Time
	AccountID    int
	CampaignID   *int
	ExperienceID string
	ScreenID     string

	// number of seconds
	Duration float64
	DeviceID string
}

func (record *ExperienceScreenViewedRecord) IsValid() (bool, error) {
	if record.AccountID == 0 {
		return false, NewInvalidError("AccountID", "is required")
	}

	if record.ExperienceID == "" {
		return false, NewInvalidError("ExperienceID", "is required")
	}

	if record.ScreenID == "" {
		return false, NewInvalidError("ScreenID", "is required")
	}

	if record.CampaignID != nil && *record.CampaignID == 0 {
		return false, NewInvalidError("CampaignID", "is required")
	}

	if record.Duration == 0 {
		return false, NewInvalidError("Duration", "is required")
	}

	if record.DeviceID == "" {
		return false, NewInvalidError("DeviceID", "is required")
	}

	return true, nil
}

type ExperienceBlockTappedRecord struct {
	Timestamp    time.Time
	AccountID    int
	CampaignID   *int
	ExperienceID string
	ScreenID     string
	BlockID      string

	// number of seconds
	Duration float64
	DeviceID string
}

func (record *ExperienceBlockTappedRecord) IsValid() (bool, error) {
	if record.AccountID == 0 {
		return false, NewInvalidError("AccountID", "is required")
	}

	if record.ExperienceID == "" {
		return false, NewInvalidError("ExperienceID", "is required")
	}

	if record.ScreenID == "" {
		return false, NewInvalidError("ScreenID", "is required")
	}

	if record.BlockID == "" {
		return false, NewInvalidError("BlockID", "is required")
	}

	if record.CampaignID != nil && *record.CampaignID == 0 {
		return false, NewInvalidError("CampaignID", "is required")
	}

	if record.Duration == 0 {
		return false, NewInvalidError("Duration", "is required")
	}

	if record.DeviceID == "" {
		return false, NewInvalidError("DeviceID", "is required")
	}

	return true, nil
}
