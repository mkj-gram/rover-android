package scylla

import (
	"github.com/gocql/gocql"
	"github.com/pkg/errors"
)

var (
	// Scylla Aliases
	ErrTimeoutNoResponse = gocql.ErrTimeoutNoResponse
	ErrTooManyTimeouts   = gocql.ErrTooManyTimeouts
	ErrConnectionClosed  = gocql.ErrConnectionClosed
	ErrNoStreams         = gocql.ErrNoStreams
)

var (
	ErrNotFound = errors.New("scylla: no rows in result set")
	ErrInvalid  = errors.New("invalid")
)

type ValidationError struct {
	message string
}

func IsRetryableError(err error) bool {
	err = errors.Cause(err)

	return err == ErrTimeoutNoResponse ||
		err == ErrConnectionClosed ||
		err == ErrNoStreams ||
		err == ErrTooManyTimeouts
}

func NewValidationError(msg string) error {
	return &ValidationError{message: msg}
}

func (v *ValidationError) Error() string { return v.message }
