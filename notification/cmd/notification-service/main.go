package main

import (
	"context"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"strings"
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
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
	notification_grpc "github.com/roverplatform/rover/notification/grpc"
	"github.com/roverplatform/rover/notification/postgres"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
)

var (
	rpcAddr  = flag.String("rpc-addr", ":5100", "rpc address")
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// Postgres
	postgresDsn = flag.String("postgres-dsn", "postgres://postgres:@postgres:5432/notification_dev?sslmode=disable", "postgres")

	// Scylla
	scyllaDsn = flag.String("scylla-dsn", "", "scylla")

	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	// GCP PubSub
	pubsubTopic = flag.String("pubsub-topic", "notifications", "GCP pubsub's topic name")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)

	verboseLog = log.New(ioutil.Discard, "", 0)
)

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

func main() {
	flag.Parse()

	var (
		isProduction = strings.Contains(*gcpProjectID, "-prod")

		ctx, cancelFn                   = context.WithCancel(context.Background())
		readinessProbes, livenessProbes []func() error

		unaryMiddleware = []grpc.UnaryServerInterceptor{
			grpc_prometheus.UnaryServerInterceptor,
			grpc_middleware.UnaryPanicRecovery(grpc_middleware.DefaultPanicHandler),
			grpc_middleware.UnaryLog(verboseLog),
		}
	)

	//
	// Logs
	//
	if !isProduction {
		// development
		verboseLog.SetOutput(os.Stdout)
	}

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
	if isProduction {
		errClient, err := gerrors.NewClient(ctx, *gcpProjectID, "notification/service", "v1", true, gcpClientOpts...)
		if err != nil {
			stderr.Fatalf("errors.NewClient: %v", err)
		} else {
			stdout.Println("gcp.errors=on")
		}

		unaryMiddleware = append(unaryMiddleware, func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
			defer func() {
				if val := recover(); val != nil {
					trace := make([]byte, 1024*10)
					trace = trace[:runtime.Stack(trace, false)]

					stderr.Printf("status=panic panic=%q trace=%q\n", val, string(trace))
					errClient.Reportf(ctx, nil, "status=panic error=%q", val)
					panic(val)
				}
			}()
			return handler(ctx, req)
		})
	}

	//
	// GCP Pubsub
	//

	pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID, gcpClientOpts...)
	if err != nil {
		stderr.Fatalf("pubsub.NewClient: %v", err)
	} else {
		stdout.Println("pubsub connected")
	}
	topic := pubsubClient.Topic(*pubsubTopic)
	stdout.Printf("pubsub:topic %s\n", topic.String())
	publisher := &notification_pubsub.Publisher{Topic: topic}

	//
	// Postgres
	//
	pg, err := postgres.Open(*postgresDsn)
	if err != nil {
		stderr.Fatalln("postgres.Open", err)
	}
	stdout.Println("postgres connected")

	pgProbe := func() error {
		if err := pg.DB().Ping(); err != nil {
			return errors.Wrap(err, "Postgres")
		}

		return nil
	}
	stdout.Println("postgres=on")

	readinessProbes = append(readinessProbes, pgProbe)
	livenessProbes = append(livenessProbes, pgProbe)

	//
	// Scylla
	//
	scyllaDB, err := scylla.Open(*scyllaDsn)
	if err != nil {
		stderr.Fatalln("scylla.Open", err)
	}

	stdout.Println("scylla=on")

	scyllaProbe := func() error {
		return scyllaDB.
			Session().
			Query("SELECT count(*) FROM system.local WHERE key='local' limit 1").
			Exec()
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
			stderr.Fatalf("net.Listen=exiting status=error error=%q\n", err)
		}

		stdout.Printf("grpc listening on %s\n", *rpcAddr)
		if err := grpcServer.Serve(lis); err != nil {
			stderr.Printf("grpc.server=exiting status=error error=%q\n", err)
		} else {
			stderr.Println("grpc.server=exiting status=OK", err)
		}
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
		if err := http.ListenAndServe(*httpAddr, nil); err != nil {
			stderr.Fatalln("http.ListenAndServe", err)
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

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	//
	// Signals
	//

	stdout.Println("status=started")
	select {
	case <-ctx.Done():
		stderr.Printf("status=cancel error=%q\n", ctx.Err())
	case sig := <-sigc:
		stdout.Printf("status=signal signal=%v\n", sig)
		cancelFn()
	}

	grpcServer.GracefulStop()

	stdout.Println("status=done")
}
