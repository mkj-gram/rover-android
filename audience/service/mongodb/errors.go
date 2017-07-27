package mongodb

import (
	"fmt"

	"github.com/pkg/errors"
	mgo "gopkg.in/mgo.v2"
)

var (
	errInvalidObjectId = fmt.Errorf("bson.IsObjectIdHex: false")
	errInvalid         = fmt.Errorf("invalid")
)

type ErrorNotFound struct {
	error
	errorClient
}

func (e ErrorNotFound) ErrorNotFound() {}

type ErrorDup struct {
	error
	errorClient
}

func (e ErrorDup) ErrorDuplicate() {}

type ErrorInvalidArgument struct {
	error
	errorClient

	ArgumentName string
	Value        interface{}
}

func (e ErrorInvalidArgument) ErrorInvalidArgument() {}

type errorClient struct{}

func (e errorClient) ErrorClient() {}

func wrapError(err error, msg string) error {
	if err == nil {
		return nil
	}

	if err == mgo.ErrNotFound {
		err = ErrorNotFound{error: err}
	} else if mgo.IsDup(err) {
		err = ErrorDup{error: err}
	}

	return errors.Wrap(err, msg)
}
