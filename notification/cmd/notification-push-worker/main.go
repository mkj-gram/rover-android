package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"sync"
	"syscall"
	"time"

	_ "github.com/lib/pq"

	gerrors "cloud.google.com/go/errors"
	"cloud.google.com/go/pubsub"
	"github.com/karlseguin/ccache"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	prom "github.com/prometheus/client_golang/prometheus"
	"google.golang.org/api/option"

	"github.com/roverplatform/rover/notification/postgres"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/push"
	"github.com/roverplatform/rover/notification/scylla"
)

var (
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	// GCP PubSub
	pubsubSubcription            = flag.String("pubsub-subscription", "notification-push-worker", "GCP pubsub's subscription name")
	pubSubMaxOutstandingMessages = flag.Int("pubsub-max-outstanding-messages", 1, "number of messages to process in parallel")

	// PlatformCache
	platformsCacheMaxSize = flag.Int("platforms-cache-max-size", 1000, "max items to cache")
	platformsCacheMaxAge  = flag.Duration("platforms-cache-max-age", time.Duration(5*time.Minute), "max age to cache")

	// worker concurrency
	workerConcurrency = flag.Int("worker-concurrency", 10, "worker concurrency")

	// Postgres
	pgDSN = flag.String("postgres-dsn", "", "postgres DSN")

	// Scylla
	scyllaDSN = flag.String("scylla-dsn", "", "scylla DSN")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())
		wg            sync.WaitGroup

		readinessProbes, livenessProbes []func() error
	)

	//
	// Prometheus
	//

	prom.MustRegister(push.PrometheusMetrics...)

	//
	// GCP
	//
	var gcpClientOpts []option.ClientOption
	if *gcpProjectID != "" {
		gcpClientOpts = append(gcpClientOpts, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
	}

	//
	// GCP errors
	//

	errClient, err := gerrors.NewClient(ctx, *gcpProjectID, "notification/push-worker", "v1", true, gcpClientOpts...)
	if err != nil {
		stderr.Fatalf("errors.NewClient: %v", err)
	} else {
		stdout.Println("gcp.errors=on")
	}

	//
	// Pubsub
	//

	pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID, gcpClientOpts...)
	if err != nil {
		stderr.Fatalf("pubsub.NewClient: %v", err)
	} else {
		stdout.Println("gcp.pubsub=on")
	}

	var (
		subscription = pubsubClient.Subscription(*pubsubSubcription)
	)

	subscription.ReceiveSettings = pubsub.ReceiveSettings{
		MaxExtension:           10 * time.Minute,
		MaxOutstandingMessages: 1000,
		MaxOutstandingBytes:    1e9, // 1G
		NumGoroutines:          *workerConcurrency,
	}

	//
	// postgres
	//

	db, err := postgres.Open(*pgDSN)
	if err != nil {
		stderr.Fatal("postgres.Open", err)
	}

	pgProbe := func() error {
		if err := db.DB().Ping(); err != nil {
			return errors.Wrap(err, "Postgres")
		}

		return nil
	}
	stdout.Println("postgres=on")

	readinessProbes = append(readinessProbes, pgProbe)
	// we don't want worker to be taken down if pgProbe fails?
	// livenessProbes = append(livenessProbes, pgProbe)

	//
	// scylla
	//

	scyllaDB, err := scylla.Open(*scyllaDSN)
	if err != nil {
		stderr.Fatal("scylla.Open: ", err)
	}

	stdout.Println("scylla=on")

	scyllaProbe := func() error {
		return scyllaDB.
			Session().
			Query("SELECT count(*) FROM system.local WHERE key='local' limit 1").
			Exec()
	}

	readinessProbes = append(readinessProbes, scyllaProbe)
	// livenessProbes = append(livenessProbes, scyllaProbe)

	//
	// Platform Cache
	//

	var platformCache = ccache.New(ccache.Configure().
		MaxSize(int64(*platformsCacheMaxSize)).
		ItemsToPrune(10),
	)

	//
	// Notification Pubsub
	//

	var (
		handler = &push.Handler{
			ClientFactory: &push.ClientFactory{
				Cache:                 platformCache,
				MaxAge:                *platformsCacheMaxAge,
				AndroidPlatformsStore: db.AndroidPlatformStore(),
				IosPlatformsStore:     db.IosPlatformStore(),
			},
			NotificationSettingsStore: scyllaDB.NotificationSettingsStore(),
			NotificationsStore:        scyllaDB.NotificationsStore(),
		}

		subscriber = notification_pubsub.Subscriber{
			Subscription: subscription,
		}

		instrument = func(h notification_pubsub.ReceiverFunc) notification_pubsub.ReceiverFunc {
			return notification_pubsub.ReceiverFunc(func(ctx context.Context, m notification_pubsub.Message) error {
				defer func() {
					if val := recover(); val != nil {
						var (
							buf = make([]byte, 1024*10)
							n   = runtime.Stack(buf, false)
						)
						stderr.Printf("status=panic panic=%q trace=%q\n", val, string(buf[:n]))
						errClient.Reportf(ctx, nil, "status=error error=%q", err)
					}
				}()

				if err := h(ctx, m); err != nil {
					stderr.Printf("status=error error=%q\n", err.Error())
					return err
				}
				return nil
			})
		}
	)

	wg.Add(1)
	go func() {
		defer wg.Done()

		handler := instrument(
			notification_pubsub.ReceiverFunc(push.WithMetrics(
				handler.Handle)))

		if err := subscriber.Subscribe(ctx, handler); err != nil {
			errClient.Reportf(ctx, nil, "pubsub.receive=exiting status=error error=%q", err)
			stderr.Printf("pubsub.receive=exiting status=error error=%q\n", err.Error())
		} else {
			stdout.Printf("pubsub.receive=exiting status=OK\n")
		}

		cancelFn()
	}()

	//
	// HTTP endpoint
	//

	go func() {
		probeChain := func(probes []func() error) http.HandlerFunc {
			return func(w http.ResponseWriter, r *http.Request) {
				var result string
				for _, probe := range probes {
					if err := probe(); err != nil {
						result += err.Error() + "\n"
						stderr.Printf("probe=error error=%q\n", err.Error())
					}
				}
				if result != "" {
					http.Error(w, result, http.StatusServiceUnavailable)
					return
				}
				w.WriteHeader(200)
				w.Write([]byte("ok"))
			}

		}

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", probeChain(readinessProbes))
		http.Handle("/liveness", probeChain(livenessProbes))

		httpServer := http.Server{
			Addr:     *httpAddr,
			ErrorLog: stderr,
			Handler:  http.DefaultServeMux,
		}

		if err := httpServer.ListenAndServe(); err != nil {
			stderr.Fatalf("http.ListenAndServe=exiting status=error error=%q\n", err)
		}
	}()

	//
	// Signals
	//

	wg.Add(1)
	go func() {
		defer wg.Done()

		sigc := make(chan os.Signal)
		signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

		select {
		case <-ctx.Done():
		case <-sigc:
			stdout.Printf("status=signal signal=%q\n", <-sigc)
			cancelFn()
		}
	}()

	stdout.Printf("status=started\n")
	wg.Wait()
	stdout.Printf("status=done\n")
}
