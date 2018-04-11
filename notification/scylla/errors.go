package scylla

import "errors"

var ErrNotFound = errors.New("scylla: no rows in result set")
