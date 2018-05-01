package push

import "github.com/pkg/errors"

var (
	ErrUnknown = errors.Errorf("unknown")
	ErrInvalid = errors.Errorf("invalid")
)

type (
	RetryableError interface {
		RetryableError() error
	}
)

type retryable struct {
	error
}

func (r retryable) RetryableError() error {
	return r.error
}
