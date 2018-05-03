package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
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

	rhttp "github.com/roverplatform/rover/go/http"
	rlog "github.com/roverplatform/rover/go/logger"
	"github.com/roverplatform/rover/notification/postgres"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/push"
	"github.com/roverplatform/rover/notification/scylla"
)

var (
	// Listeners
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	// GCP PubSub
	pubsubSubcription            = flag.String("pubsub-subscription", "notification-push-worker", "GCP pubsub's subscription name")
	pubSubMaxOutstandingMessages = flag.Int("pubsub-max-outstanding-messages", 1, "number of messages to process in parallel")

	// Logs
	logLevel = flag.String("log-level", "info", "log level")

	// PlatformCache
	platformsCacheMaxSize = flag.Int("platforms-cache-max-size", 1000, "max items to cache")
	platformsCacheMaxAge  = flag.Duration("platforms-cache-max-age", time.Duration(5*time.Minute), "max age to cache")

	// Rover Inbox
	roverInboxCertificateData = flag.String("rover-inbox-cert-data", "", "rover inbox certificate data")
	roverInboxCertificatePass = flag.String("rover-inbox-cert-pass", "", "rover inbox certificate pass")

	// worker concurrency
	workerConcurrency = flag.Int("worker-concurrency", 10, "worker concurrency")

	// Postgres
	pgDSN = flag.String("postgres-dsn", "", "postgres DSN")

	// Scylla
	scyllaDSN = flag.String("scylla-dsn", "", "scylla DSN")
)

var (
	log = rlog.New()
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())
		wg            sync.WaitGroup

		readinessProbes, livenessProbes []rhttp.ProbeFunc
	)

	//
	// Logs
	//
	log.SetLevel(rlog.LevelFromString(*logLevel))

	//
	// Prometheus
	//

	prom.MustRegister(push.PrometheusMetrics...)
	prom.MustRegister(notification_pubsub.PrometheusMetrics...)

	//
	// GCP
	//
	var gcpClientOpts []option.ClientOption
	if *gcpSvcAcctKeyPath != "" {
		gcpClientOpts = append(gcpClientOpts, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
	}

	//
	// GCP errors
	//

	errClient, err := gerrors.NewClient(ctx, *gcpProjectID, "notification/push-worker", "v1", true, gcpClientOpts...)
	if err != nil {
		log.Fatalf("errors.NewClient: %v", err)
	}
	log.Infof("gcp.errors=on")

	//
	// Pubsub
	//

	pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID, gcpClientOpts...)
	if err != nil {
		log.Fatalf("pubsub.NewClient: %v", err)
	}
	log.Infof("gcp.pubsub=on")

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

	pg, err := postgres.Open(*pgDSN)
	if err != nil {
		log.Fatalf("postgres.Open:%v", err)
	}
	log.Infof("postgres=on")
	defer pg.Close()

	pgProbe := func(ctx context.Context) error {
		if err := pg.DB().PingContext(ctx); err != nil {
			return errors.Wrap(err, "postgres")
		}

		return nil
	}

	readinessProbes = append(readinessProbes, pgProbe)
	// TODO: take down worker if pgProbe fails?
	livenessProbes = append(livenessProbes, pgProbe)

	if *roverInboxCertificateData != "" {
		p, err := postgres.ParseIosPlatform(*roverInboxCertificateData, *roverInboxCertificatePass)
		if err != nil {
			log.Fatalf("ParseIosPlatform: %v", err)
		}
		postgres.RoverInboxIosPlatform = p
	}

	//
	// scylla
	//

	scyllaDB, err := scylla.Open(*scyllaDSN)
	if err != nil {
		log.Fatalf("scylla.Open: %v", err)
	}
	defer scyllaDB.Close()

	log.Infof("scylla=on")

	scyllaProbe := func(_ context.Context) error {
		return errors.Wrap(scyllaDB.Ping(), "scylla")
	}

	readinessProbes = append(readinessProbes, scyllaProbe)
	livenessProbes = append(livenessProbes, scyllaProbe)

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
				AndroidPlatformsStore: pg.AndroidPlatformStore(),
				IosPlatformsStore:     pg.IosPlatformStore(),
			},
			NotificationSettingsStore: scyllaDB.NotificationSettingsStore(),
			NotificationsStore:        scyllaDB.NotificationsStore(),
		}

		subscriber = notification_pubsub.Subscriber{
			Subscription: subscription,
		}

		instrument = func(h notification_pubsub.ReceiverFunc) notification_pubsub.ReceiverFunc {
			return notification_pubsub.ReceiverFunc(func(ctx context.Context, m notification_pubsub.Message) error {
				var (
					err   error
					start = time.Now()
				)

				defer errClient.Catch(ctx, gerrors.Repanic(false))

				defer func() {
					log := log.WithFields(rlog.Fields{
						"src": "handler.handle", "dur": time.Since(start),
					})

					if err != nil {
						log.Error(err.Error())
					} else {
						log.Infof("status=ok")
					}
				}()

				err = h(ctx, m)

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

		log := log.WithFields(rlog.Fields{"src": "pubsub.receive"})

		if err := subscriber.Subscribe(ctx, handler); err != nil {
			log.Error(err.Error())
		} else {
			log.Infof("exiting")
		}

		cancelFn()
	}()

	//
	// HTTP endpoint
	//

	go func() {

		log := log.WithFields(rlog.Fields{"probe": ""})

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", rhttp.ProbeChain(ctx, log, readinessProbes...))
		http.Handle("/liveness", rhttp.ProbeChain(ctx, log, livenessProbes...))

		httpServer := http.Server{
			Addr: *httpAddr,
			// ErrorLog: stderr,
			Handler: http.DefaultServeMux,
		}

		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatalf("http.ListenAndServe=exiting error=%q", err)
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
		case sig := <-sigc:
			log.Infof("signal=%q\n", sig)
			cancelFn()
		}
	}()

	log.Infof("status=started\n")
	wg.Wait()
	log.Infof("status=done\n")
}
