package cql

import "github.com/gocql/gocql"

func Open(dsn string) (*gocql.Session, error) {
	config, err := ParseDSN(dsn)
	if err != nil {
		return nil, err
	}

	session, err := config.CreateSession()
	if err != nil {
		return nil, err
	}

	return session, nil
}
