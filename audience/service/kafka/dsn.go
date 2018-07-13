package kafka

import (
	"net/url"

	"github.com/pkg/errors"
)

var DefaultConfig = func() ConfigMap {
	return ConfigMap{
		"session.timeout.ms":      6000,
		"compression.codec":       "snappy",
		"socket.keepalive.enable": true,
		"request.required.acks":   -1,
		"default.topic.config": ConfigMap{
			"compression.codec":  "snappy",
			"auto.offset.reset":  "earliest",
			"auto.commit.enable": true, // let kafka client auto commit offsets for us
		},
	}
}

// ParseDSN parses dsn url and populates provided ConfigMap.
func ParseDSN(dsn string, cfg ConfigMap) (ConfigMap, error) {
	u, err := url.Parse(dsn)
	if err != nil {
		return cfg, errors.Wrap(err, "url.Parse")
	}

	if cfg == nil {
		cfg = ConfigMap{}
	}

	if u.Host == "" {
		cfg["bootstrap.servers"] = dsn
	} else {
		cfg["bootstrap.servers"] = u.Host
	}

	for k, _ := range u.Query() {
		cfg[k] = u.Query().Get(k)
	}

	return cfg, nil
}
