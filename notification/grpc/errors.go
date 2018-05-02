package grpc

import (
	"database/sql"

	"github.com/lib/pq"
	"google.golang.org/grpc/codes"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/notification/scylla"
)

func ErrToStatus(err error) codes.Code {
	err = errors.Cause(err)

	switch err {
	case sql.ErrNoRows:
		return codes.NotFound
	case sql.ErrConnDone, sql.ErrTxDone:
		return codes.Internal
	case scylla.ErrInvalid:
		return codes.InvalidArgument
	case scylla.ErrNotFound:
		return codes.NotFound
	}

	if _, ok := err.(*pq.Error); ok {
		return codes.Internal
	}

	if _, ok := err.(*scylla.ValidationError); ok {
		return codes.InvalidArgument
	}

	return codes.Unknown
}
