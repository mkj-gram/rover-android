package cql_test

import (
	"testing"
	"time"

	"github.com/gocql/gocql"
	"github.com/roverplatform/rover/go/cql"
	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestParseDSN(t *testing.T) {
	type config struct {
		Hosts         []string
		Keyspace      string
		Authenticator gocql.Authenticator
		Consistency   gocql.Consistency
		Timeout       time.Duration
	}

	tests := []struct {
		name string

		dsn         string
		expect      *config
		expectError error
	}{

		{
			name: "defaults",
			dsn:  "scylla://host1:9092/keyspace",

			expect: &config{
				Hosts:       []string{"host1:9092"},
				Consistency: gocql.Quorum,
				Keyspace:    "keyspace",
				Timeout:     time.Duration(600 * time.Millisecond),
			},
		},
		{
			name: "complex",
			dsn:  "scylla://hello:world@host1:99,host2:191,host3:9092/keyspace?consistency=all&timeout=1s",

			expect: &config{
				Hosts:       []string{"host1:99", "host2:191", "host3:9092"},
				Consistency: gocql.All,
				Keyspace:    "keyspace",
				Authenticator: gocql.PasswordAuthenticator{
					Username: "hello",
					Password: "world",
				},
				Timeout: time.Duration(1 * time.Second),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			var (
				exp, expErr = tt.expect, tt.expectError
				cfg, gotErr = cql.ParseDSN(tt.dsn)
				got         *config
			)

			if gotErr == nil {
				got = &config{
					Authenticator: cfg.Authenticator,
					Consistency:   cfg.Consistency,
					Hosts:         cfg.Hosts,
					Keyspace:      cfg.Keyspace,
					Timeout:       cfg.Timeout,
				}
			}

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}
		})
	}
}
