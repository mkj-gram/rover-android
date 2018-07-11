package usecase

import (
	"github.com/roverplatform/rover/analytics/backend/domain"
)

type ExperienceViewedStore interface {
	Create(records ...*domain.ExperienceViewedRecord) error
}

type ExperienceScreenViewedStore interface {
	Create(records ...*domain.ExperienceScreenViewedRecord) error
}

type ExperienceBlockTappedStore interface {
	Create(records ...*domain.ExperienceBlockTappedRecord) error
}

type ExperienceInteractor struct {
	ViewedStore       ExperienceViewedStore
	ScreenViewedStore ExperienceScreenViewedStore
	BlockTappedStore  ExperienceBlockTappedStore
}

func (interactor *ExperienceInteractor) RecordViewed(records ...*domain.ExperienceViewedRecord) error {
	if records == nil {
		return nil
	}

	for _, record := range records {
		if ok, err := record.IsValid(); !ok {
			return err
		}
	}

	return interactor.ViewedStore.Create(records...)
}

func (interactor *ExperienceInteractor) RecordScreenViewed(records ...*domain.ExperienceScreenViewedRecord) error {
	if records == nil {
		return nil
	}

	for _, record := range records {
		if ok, err := record.IsValid(); !ok {
			return err
		}
	}

	return interactor.ScreenViewedStore.Create(records...)
}

func (interactor *ExperienceInteractor) RecordBlockTapped(records ...*domain.ExperienceBlockTappedRecord) error {
	if records == nil {
		return nil
	}

	for _, record := range records {
		if ok, err := record.IsValid(); !ok {
			return err
		}
	}

	return interactor.BlockTappedStore.Create(records...)
}
