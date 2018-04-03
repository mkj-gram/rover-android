package pipeline

import "fmt"

type Error struct {
	err       error
	retryable bool
}

func (e *Error) Error() string {
	return fmt.Sprintf("%s retryable = %t", e.err.Error(), e.retryable)
}

func NewRetryableError(err error) *Error {
	return &Error{
		err:       err,
		retryable: true,
	}
}

func IsRetryableError(err error) bool {
	if e, ok := err.(*Error); ok {
		return e.retryable
	}

	return false
}
