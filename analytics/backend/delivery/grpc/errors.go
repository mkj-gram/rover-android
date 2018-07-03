package grpc

import (
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/analytics/backend/domain"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func statusFromError(err error) error {
	err = errors.Cause(err)
	if err == nil {
		return status.Error(codes.Unknown, "empty error")
	}

	if err == domain.ErrNotFound {
		return status.Error(codes.NotFound, err.Error())
	}

	switch err.(type) {
	case *domain.ErrInvalid:
		return status.Error(codes.InvalidArgument, err.Error())
	}

	return status.Error(codes.Unknown, err.Error())
}
