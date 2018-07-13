package grpc

import (
	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func IsRetryableError(err error) bool {
	if err == nil {
		return false
	}

	err = errors.Cause(err)

	statuscode, ok := status.FromError(err)
	if !ok {
		return false
	}

	switch statuscode.Code() {
	case codes.Canceled, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Internal, codes.Unavailable:
		return true
	default:
		return false
	}
}
