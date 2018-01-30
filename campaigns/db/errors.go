package db

import (
	"database/sql"

	"github.com/lib/pq"
	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
)

func wrapError(err error, desc string) error {
	return errors.Wrap(err, desc)
}

func wrapfError(err error, fmt string, args interface{}) error {
	return errors.Wrapf(err, fmt, args)
}

func ErrorToStatus(err error) codes.Code {
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
