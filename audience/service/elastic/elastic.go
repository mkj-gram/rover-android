package elastic

import (
	"strconv"

	"github.com/pkg/errors"
)

var (
	InvalidArgument = errors.Errorf("invalid argument")
)

var (
	AccountIndex = func(id string) string {
		return "account_" + id
	}
	AccountIndexInt = func(id int) string {
		return AccountIndex(strconv.Itoa(id))
	}
)
