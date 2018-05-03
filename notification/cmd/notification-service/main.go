package main

import (
	"context"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	_ "github.com/lib/pq"

	gerrors "cloud.google.com/go/errors"
	"cloud.google.com/go/pubsub"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	prom "github.com/prometheus/client_golang/prometheus"
	"google.golang.org/api/option"
	"google.golang.org/grpc"

	"github.com/roverplatform/rover/apis/go/notification/v1"
	grpc_logs "github.com/roverplatform/rover/go/grpc/logs"
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
	rhttp "github.com/roverplatform/rover/go/http"
	rlog "github.com/roverplatform/rover/go/logger"
	notification_grpc "github.com/roverplatform/rover/notification/grpc"
	"github.com/roverplatform/rover/notification/postgres"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
)

var (
	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	// GCP PubSub
	pubsubTopic = flag.String("pubsub-topic", "notifications", "GCP pubsub's topic name")

	// Logs
	logLevel = flag.String("log-level", "info", "log level")

	// Listeners
	rpcAddr  = flag.String("rpc-addr", ":5100", "rpc address")
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// Postgres
	postgresDsn = flag.String("postgres-dsn", "postgres://postgres:@postgres:5432/notification_dev?sslmode=disable", "postgres")

	// Scylla
	scyllaDsn = flag.String("scylla-dsn", "", "scylla")
)

var (
	log = rlog.New()
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())

		readinessProbes, livenessProbes []rhttp.ProbeFunc

		unaryMiddleware = []grpc.UnaryServerInterceptor{
			grpc_prometheus.UnaryServerInterceptor,
			grpc_middleware.UnaryPanicRecovery(grpc_logs.Recoverer(log)),
			grpc_logs.UnaryInterceptor(log),
		}
	)

	//
	// Prometheus
	//
	prom.MustRegister(notification_pubsub.PrometheusMetrics...)

	//
	// Logs
	//
	log.SetLevel(rlog.LevelFromString(*logLevel))

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
	if *gcpSvcAcctKeyPath != "" {
		errClient, err := gerrors.NewClient(ctx, *gcpProjectID, "notification/service", "v1", true, gcpClientOpts...)
		if err != nil {
			log.Fatalf("errors.NewClient: %v", err)
		} else {
			log.Infof("gcp.errors=on")
		}

		unaryMiddleware = append(unaryMiddleware, func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
			defer errClient.Catch(ctx, gerrors.Repanic(true))
			return handler(ctx, req)
		})
	}

	//
	// GCP Pubsub
	//

	pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID, gcpClientOpts...)
	if err != nil {
		log.Errorf("pubsub.NewClient: %v", err)
	} else {
		log.Infof("gcp.pubsub=connected")
	}
	topic := pubsubClient.Topic(*pubsubTopic)
	log.Infof("pubsub.topic=%s\n", topic.String())
	publisher := &notification_pubsub.Publisher{Topic: topic}

	//
	// Postgres
	//
	pg, err := postgres.Open(*postgresDsn)
	if err != nil {
		log.Fatalf("postgres.Open: %v", err)
	}
	defer pg.Close()

	log.Infof("postgres=on")

	pgProbe := func(ctx context.Context) error {
		if err := pg.DB().PingContext(ctx); err != nil {
			return errors.Wrap(err, "Postgres")
		}

		return nil
	}

	readinessProbes = append(readinessProbes, pgProbe)
	livenessProbes = append(livenessProbes, pgProbe)

	//
	// Scylla
	//
	scyllaDB, err := scylla.Open(*scyllaDsn)
	if err != nil {
		log.Fatalf("scylla.Open:", err)
	}
	defer scyllaDB.Close()

	log.Infof("scylla=on")

	scyllaProbe := func(_ context.Context) error {
		return errors.Wrap(scyllaDB.Ping(), "scylla")
	}

	readinessProbes = append(readinessProbes, scyllaProbe)
	livenessProbes = append(livenessProbes, scyllaProbe)

	//
	// Notification Server
	//
	server := &notification_grpc.Server{
		PlatformServer: notification_grpc.PlatformServer{
			DB: pg,
		},
		NotificationServer: notification_grpc.NotificationServer{
			DB:        &ScyllaStore{db: scyllaDB},
			Publisher: publisher,
		},
	}

	//
	// GRPC
	//

	var (
		grpcServerOpts = []grpc.ServerOption{
			grpc.UnaryInterceptor(grpc_middleware.UnaryChain(unaryMiddleware...)),
			grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
		}

		grpcServer = grpc.NewServer(grpcServerOpts...)
	)
	go func() {
		defer cancelFn()

		notification.RegisterNotificationServer(grpcServer, server)

		lis, err := net.Listen("tcp", *rpcAddr)
		if err != nil {
			log.Fatal("net.Listen:", err.Error())
		}

		log.Infof("grpc=listening addr=%q\n", *rpcAddr)
		if err := grpcServer.Serve(lis); err != nil {
			log.Errorf("grpc.server=exiting error=%q\n", err)
		} else {
			log.Infof("grpc.server=exiting")
		}
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
			// TODO:
			// ErrorLog: stderr,
			Handler: http.DefaultServeMux,
		}

		if err := httpServer.ListenAndServe(); err != nil {
			log.Errorf("http.server=exiting error=%q\n", err)
		}
	}()

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	//
	// Signals
	//

	log.Infof("status=started\n")
	select {
	case <-ctx.Done():
		log.Errorf("status=cancel error=%q\n", ctx.Err())
	case sig := <-sigc:
		log.Infof("status=signal signal=%v\n", sig)
		cancelFn()
	}

	grpcServer.GracefulStop()

	log.Infof("status=done\n")
}

// Wrapper around scylla.DB to support grpc use-cases
type ScyllaStore struct {
	db *scylla.DB
}

func (n *ScyllaStore) NotificationSettingsStore() notification_grpc.NotificationSettingsStore {
	return n.db.NotificationSettingsStore()
}

func (n *ScyllaStore) NotificationStore() notification_grpc.NotificationStore {
	return n.db.NotificationsStore()
}
