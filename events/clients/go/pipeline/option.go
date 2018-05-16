package pipeline

import (
	"time"

	"github.com/roverplatform/rover/go/retry"
)

var defaultConfig = Config{
	ReadTimeout: 100 * time.Millisecond,

	Retry: retry.Backoff{
		MaxAttempts: 10,
		Factor:      2,
		Jitter:      true,
		Min:         50 * time.Millisecond,
		Max:         1 * time.Second,
	},
}

type Config struct {
	ReadTimeout time.Duration

	Retry retry.Backoff
}

type Option func(config *Config)
