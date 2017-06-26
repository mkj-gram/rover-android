package service

import (
	"errors"

	"google.golang.org/grpc/codes"
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
		return codes.Internal
	}
}
