package retry

import (
	"context"
	"math"
	"math/rand"
	"time"
)

// Backoff is a time.Duration counter, starting at Min. After every call to
// the Duration method the current timing is multiplied by Factor, but it
// never exceeds Max.
//
type Backoff struct {
	// Maximum number of attempts before failing
	MaxAttempts int
	//Factor is the multiplying factor for each increment step
	Factor float64
	//Jitter eases contention by randomizing backoff steps
	Jitter bool
	//Min and Max are the minimum and maximum values of the counter
	Min, Max time.Duration
}

const maxInt64 = float64(math.MaxInt64 - 512)

// ForAttempt returns the duration for a specific attempt.
// The first attempt should be 0.
//
// ForAttempt is concurrent-safe.
func (b *Backoff) ForAttempt(attempt int) time.Duration {
	// Zero-values are nonsensical, so we use
	// them to apply defaults
	min := b.Min
	if min <= 0 {
		min = 100 * time.Millisecond
	}
	max := b.Max
	if max <= 0 {
		max = 10 * time.Second
	}
	if min >= max {
		// short-circuit
		return max
	}
	factor := b.Factor
	if factor <= 0 {
		factor = 2
	}
	//calculate this duration
	minf := float64(min)
	durf := minf * math.Pow(factor, float64(attempt))
	if b.Jitter {
		durf = rand.Float64()*(durf-minf) + minf
	}
	//ensure float64 wont overflow int64
	if durf > maxInt64 {
		return max
	}
	dur := time.Duration(durf)
	//keep within bounds
	if dur < min {
		return min
	} else if dur > max {
		return max
	}
	return dur
}

// Do calls work function specified number of times as configured
// work must return true in order to be retried
// Do returns true if work needs not be retried unless MaxAttempts exausted
func (b *Backoff) Do(ctx context.Context, work func() (retry bool)) (ok bool) {
	var (
		attempt = 0
	)

	for attempt < b.MaxAttempts {
		if attempt == 0 {
			select {
			case <-ctx.Done():
				return false
			default:
			}
		}

		if attempt > 0 {
			select {
			case <-ctx.Done():
				return false
			case <-time.After(b.ForAttempt(attempt)):
				// delay
			}
		}

		if retry := work(); retry {
			attempt += 1
			continue
		}
		break
	}

	return attempt < b.MaxAttempts
}
