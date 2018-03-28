package pipeline

import "time"

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
