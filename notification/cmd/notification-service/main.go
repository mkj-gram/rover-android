package main

import (
	"context"
	"io/ioutil"
	"net/http"
	"runtime"

	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	gerrors "cloud.google.com/go/errors"
	_ "github.com/lib/pq"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"google.golang.org/api/option"
	"google.golang.org/grpc"

	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	prom "github.com/prometheus/client_golang/prometheus"
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"

	"github.com/roverplatform/rover/apis/go/notification/v1"
	notification_grpc "github.com/roverplatform/rover/notification/grpc"
	"github.com/roverplatform/rover/notification/postgres"
	"github.com/roverplatform/rover/notification/scylla"
)

var (
	httpAddr = flag.String("rpc-addr", ":5080", "http address")
	rpcAddr  = flag.String("rpc-addr", ":5100", "rpc address")

	// Postgres
	postgresDsn = flag.String("postgres-dsn", "postgres://postgres:@localhost/test?sslmode=disable", "postgres")

	// Scylla
	scyllaDsn = flag.String("scylla-dsn", "", "scylla")

	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")
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
		ctx, cancelFn = context.WithCancel(context.Background())

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
	if *gcpProjectID == "" {
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

	if *gcpProjectID != "" {
		errClient, err := gerrors.NewClient(ctx, *gcpProjectID, "notification/push-worker", "v1", true, gcpClientOpts...)
		if err != nil {
			stderr.Fatalf("errors.NewClient: %v", err)
		} else {
			stdout.Println("gcp.errors=on")
		}

		unaryMiddleware = append(unaryMiddleware, func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
			defer func() {
				if val := recover(); val != nil {
					var (
						buf = make([]byte, 1024*10)
						n   = runtime.Stack(buf, false)
					)
					stderr.Printf("status=panic panic=%q trace=%q\n", val, string(buf[:n]))
					errClient.Reportf(ctx, nil, "status=panic error=%q", err)
					panic(val)
				}
			}()
			return handler(ctx, req)
		})
	}

	//
	// Postgres
	//
	pg, err := postgres.Open(*postgresDsn)
	if err != nil {
		stderr.Fatalln("postgres.Open", err)
	}

	pgProbe := func() error {
		if err := pg.DB().Ping(); err != nil {
			return errors.Wrap(err, "Postgres")
		}

		return nil
	}
	stdout.Println("postgres=on")

	readinessProbes = append(readinessProbes, pgProbe)
	// livenessProbes = append(livenessProbes, pgProbe)

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
	// livenessProbes = append(livenessProbes, scyllaProbe)

	//
	// Notification Server
	//

	server := &notification_grpc.Server{
		PlatformServer: notification_grpc.PlatformServer{
			DB: pg,
		},
		NotificationServer: notification_grpc.NotificationServer{
			DB: &ScyllaStore{db: scyllaDB},
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

	log.Println("status=started")
	select {
	case <-ctx.Done():
		log.Printf("status=cancel error=%q\n", ctx.Err())
	case sig := <-sigc:
		log.Printf("status=signal signal=%v\n", sig)
		cancelFn()
	}

	grpcServer.GracefulStop()

	log.Println("status=done")
}
