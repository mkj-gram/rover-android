package pipeline

import (
	"time"

	"github.com/roverplatform/rover/go/logger"
)

type Option func(p *Pipeline)

func WithTimeFunc(fn func() time.Time) Option {
	return func(p *Pipeline) {
		p.timeNow = fn
	}
}

func WithBackoff(b *Backoff) Option {
	return func(p *Pipeline) {
		p.backoff = b
	}
}

func WithLogger(logger logger.Logger) Option {
	return func(p *Pipeline) {
		p.logger = logger
	}
}
