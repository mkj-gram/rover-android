package domain

import (
	"fmt"

	"github.com/pkg/errors"
)

var (
	ErrNotFound = errors.New("Not Found")
)

type ErrInvalid struct {
	Attribute string
	Message   string
}

func (err *ErrInvalid) Error() string {
	return fmt.Sprintf("%s: %s", err.Attribute, err.Message)
}

func NewInvalidError(attribute string, message string) *ErrInvalid {
	return &ErrInvalid{
		Attribute: attribute,
		Message:   message,
	}
}
