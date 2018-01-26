package campaigns_grpc

import (
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/campaigns/db"
	"github.com/roverplatform/rover/campaigns/validations"
	"google.golang.org/grpc/codes"
)

func wrapError(err error, desc string) error {
	return errors.Wrap(err, desc)
}

func ErrorToStatus(err error) codes.Code {
	err = errors.Cause(err)
	if code := db.ErrorToStatus(err); code != codes.Unknown {
		return code
	}

	if validations.IsError(err) {
		return codes.InvalidArgument
	}

	return codes.Unknown
}
