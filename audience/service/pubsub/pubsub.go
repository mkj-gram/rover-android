package pubsub

import (
	"encoding/json"
	"sync"
	"time"

	"cloud.google.com/go/pubsub"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/go/log"

	"golang.org/x/net/context"
)

type (
	Publisher interface {
		Publish(context.Context, []service.Message) (string, error)
	}
)

type Notifier struct {
	Pubc          chan []service.Message
	Batchc        chan service.Message
	Log           log.Interface
	FlushInterval time.Duration
	BatchSize     int
	NWorkers      int
}

func (n *Notifier) Notify(ctx context.Context, msg service.Message) error {
	select {
	// non-blocking push
	case n.Batchc <- msg:
		//success
	default:
		n.Log.Errorf("notify: push failed: %v", msg)
	}

	return nil
}

func (n *Notifier) Listen(ctx context.Context) {
	var (
		msgs   = make([]service.Message, 0, n.BatchSize)
		ticker = time.NewTicker(n.FlushInterval)

		flush = func() {
			select {
			case n.Pubc <- msgs:
				msgs = make([]service.Message, 0, n.BatchSize)
			default:
				n.Log.Errorf("notify: listen: failed to submit batch")
			}
		}
	)

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if len(msgs) == 0 {
				continue
			}
			flush()
		case msg := <-n.Batchc:
			msgs = append(msgs, msg)
			if len(msgs) >= n.BatchSize {
				flush()
			}
		}
	}
}

func (nf *Notifier) Publish(ctx context.Context, topic Publisher) error {
	var wg sync.WaitGroup

	for n := 0; n < nf.NWorkers; n++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				case batch := <-nf.Pubc:
					if id, err := topic.Publish(ctx, batch); err != nil {
						nf.Log.Errorf("notifier: %v", err)
					} else {
						nf.Log.Infof("notifier: pushed %d messages. Id: %s", len(batch), id)
					}
				}
			}

		}()
	}

	wg.Wait()

	return nil
}

func TopicPublisher(pub *pubsub.Topic) PublisherFunc {
	return PublisherFunc(func(ctx context.Context, msgs []service.Message) (string, error) {
		data, err := json.Marshal(msgs)
		if err != nil {
			return "", errors.Wrap(err, "json.Marshal")
		}

		pr := pub.Publish(ctx, &pubsub.Message{Data: data})
		id, err := pr.Get(ctx)

		return id, err
	})
}

type PublisherFunc func(context.Context, []service.Message) (string, error)

func (fp PublisherFunc) Publish(ctx context.Context, msg []service.Message) (string, error) {
	id, err := fp(ctx, msg)
	return id, err
}
