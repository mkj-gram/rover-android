package scylla

import "errors"

var ErrNotFound = errors.New("scylla: no rows in result set")

type ValidationError struct {
	message string
}

func NewValidationError(msg string) error {
	return &ValidationError{message: msg}
}

func (v *ValidationError) Error() string { return v.message }
