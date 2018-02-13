package service

import (
	"github.com/pkg/errors"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/roverplatform/rover/audience/service/elastic"
)

var (
	errBlank = errors.New("blank")
)

type (
	errorNotFound interface {
		ErrorNotFound()
	}

	errorClient interface {
		ErrorClient()
	}

	errorDuplicate interface {
		ErrorDuplicate()
	}

	errorInvalidArgument interface {
		ErrorInvalidArgument()
	}
)

func ErrorToStatus(err error) codes.Code {
	if s, ok := status.FromError(err); ok {
		return s.Code()
	}

	if err == elastic.InvalidArgument {
		return codes.InvalidArgument
	}

	switch err.(type) {
	case nil:
		return codes.OK
	case errorNotFound:
		return codes.NotFound
	case errorDuplicate:
		return codes.AlreadyExists
	case errorInvalidArgument:
		return codes.InvalidArgument
	case errorClient:
		return codes.InvalidArgument
	default:
		return codes.Unknown
	}
}
