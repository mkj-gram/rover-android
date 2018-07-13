package kafka

import (
	"testing"

	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestDSN(t *testing.T) {

	tcases := []struct {
		desc     string
		url      string
		defaults ConfigMap
		exp      ConfigMap
		expErr   error
	}{
		{
			url:      "kafka:123",
			defaults: nil,
			exp: ConfigMap{
				"bootstrap.servers": "kafka:123",
			},
		},

		{
			url:      "kafka://server1:123,server2:456?group.id=hello",
			defaults: nil,
			exp: ConfigMap{
				"bootstrap.servers": "server1:123,server2:456",
				"group.id":          "hello",
			},
		},

		{
			desc:     "with defaults",
			url:      "kafka://server1:123,server2:456?group.id=hello",
			defaults: DefaultConfig(),
			exp: ConfigMap{
				"bootstrap.servers":       "server1:123,server2:456",
				"group.id":                "hello",
				"session.timeout.ms":      6000,
				"compression.codec":       "snappy",
				"socket.keepalive.enable": true,
				"request.required.acks":   -1,
				"default.topic.config": ConfigMap{
					"compression.codec":  "snappy",
					"auto.offset.reset":  "earliest",
					"auto.commit.enable": true, // let kafka client auto commit offsets for us
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = ParseDSN(tc.url, tc.defaults)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n %v", diff)
			}
		})
	}
}
