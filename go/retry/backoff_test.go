package retry_test

import (
	"context"
	"testing"
	"time"

	"github.com/roverplatform/rover/go/retry"
)

func Test_Do(t *testing.T) {
	var (
		twoTimes = &retry.Backoff{
			MaxAttempts: 2,
			Min:         10 * time.Millisecond,
		}
	)

	t.Run("no attempts with cancelled context", func(t *testing.T) {
		var (
			ctx, cancelFunc = context.WithCancel(context.Background())
			attempts        int
		)
		cancelFunc()

		twoTimes.Do(ctx, func() bool {
			attempts += 1
			return true
		})

		if attempts != 0 {
			t.Fatalf("expected no attempts on cancelled context")
		}
	})

	t.Run("attempts until exhausted", func(t *testing.T) {
		var (
			ctx      = context.Background()
			attempts int
		)

		ok := twoTimes.Do(ctx, func() bool {
			attempts += 1
			return true
		})

		if attempts != 2 {
			t.Fatalf("exp attempts=2; got attempts=%d", attempts)
		}

		if ok {
			t.Fatalf("exp ok=false; got ok=%v", ok)
		}
	})

	t.Run("attempts until success", func(t *testing.T) {
		var (
			ctx      = context.Background()
			attempts int
		)

		ok := twoTimes.Do(ctx, func() bool {
			if attempts == 1 {
				return false
			}
			attempts += 1
			return true
		})

		if attempts != 1 {
			t.Fatalf("exp attempts=1; got attempts=%d", attempts)
		}

		if !ok {
			t.Fatalf("exp ok=true; got ok=%v", ok)
		}
	})

	t.Run("attempts until timeout", func(t *testing.T) {
		var (
			ctx, _   = context.WithTimeout(context.Background(), time.Millisecond*3)
			attempts int
		)

		ok := twoTimes.Do(ctx, func() bool {
			attempts += 1
			return true
		})

		if attempts != 1 {
			t.Fatalf("exp attempts=1; got attempts=%d", attempts)
		}

		if ctx.Err() == nil {
			t.Fatalf("exp ctx.Err()==nil; got ctx.Err()=%v", ctx.Err())
		}

		if ok {
			t.Fatalf("exp ok=false; got ok=%v", ok)
		}
	})
}
