package scylla

import (
	"net/url"
	"strings"
)

type DSN struct {
	Hosts    []string
	Keyspace string
}

func ParseDSN(path string) (DSN, error) {
	u, err := url.Parse(path)
	if err != nil {
		return DSN{}, err
	}

	var dsn = DSN{
		Hosts:    strings.Split(u.Host, ","),
		Keyspace: u.Path[1:],
	}

	return dsn, nil
}
