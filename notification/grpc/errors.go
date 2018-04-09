package grpc

import (
	"database/sql"

	"github.com/lib/pq"
	"google.golang.org/grpc/codes"

	"github.com/pkg/errors"
)

func ErrToStatus(err error) codes.Code {
	err = errors.Cause(err)

	switch err {
	case sql.ErrNoRows:
		return codes.NotFound
	case sql.ErrConnDone, sql.ErrTxDone:
		return codes.Internal
	}

	if _, ok := err.(*pq.Error); ok {
		return codes.Internal
	}

	return codes.Unknown
}
