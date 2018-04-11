package scylla_test

import (
	rtesting "github.com/roverplatform/rover/go/testing"
	"github.com/roverplatform/rover/notification/scylla"
	"testing"
)

func TestParseDSN(t *testing.T) {

	tests := []struct {
		name string

		dsn         string
		expect      scylla.DSN
		expectError error
	}{
		{
			name: "parses multiple hosts",
			dsn:  "scylla://host1:99,host2:191,host3:9092/",

			expect: scylla.DSN{
				Hosts: []string{"host1:99", "host2:191", "host3:9092"},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var (
				exp, expErr = tt.expect, tt.expectError
				got, gotErr = scylla.ParseDSN(tt.dsn)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}
		})
	}
}
