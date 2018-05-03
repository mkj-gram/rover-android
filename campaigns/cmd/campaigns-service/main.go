package main

import (
	"net"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"syscall"
	"time"

	"golang.org/x/net/context"
	_ "golang.org/x/net/trace"

	_ "github.com/lib/pq"
	"github.com/pkg/errors"

	"github.com/namsral/flag"

	"github.com/grpc-ecosystem/go-grpc-prometheus"
	prom "github.com/prometheus/client_golang/prometheus"

	gerrors "cloud.google.com/go/errors"
	"google.golang.org/api/option"
	"google.golang.org/grpc"

	"github.com/roverplatform/rover/campaigns/db"
	campaigns_grpc "github.com/roverplatform/rover/campaigns/grpc"
	grpc_logs "github.com/roverplatform/rover/go/grpc/logs"
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
	rhttp "github.com/roverplatform/rover/go/http"
	rlog "github.com/roverplatform/rover/go/logger"
)

var (
	//
	// GCP
	//
	gcpProjectId      = flag.String("gcp-project-id", "", "GCP Project ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	//
	// Logs
	//
	logLevel = flag.String("log-level", "info", "log level")

	//
	// Postgres
	//
	dbDSN = flag.String("db-dsn", "", "Postgres DSN url")

	//
	// Listeners
	//
	rpcAddr  = flag.String("rpc-addr", ":5100", "The server port")
	httpAddr = flag.String("http-addr", ":5080", "http address")
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

	defer cancelFn()

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
		errClient, err := gerrors.NewClient(ctx, *gcpProjectId, "campaigns/service", "v1", true, gcpClientOpts...)
		if err != nil {
			log.Fatalf("errors.NewClient: %v", err)
		}

		unaryMiddleware = append(unaryMiddleware, func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
			defer errClient.Catch(ctx, gerrors.Repanic(true))
			return handler(ctx, req)
		})

	} else {
		log.Infof("google.errors=off")
	}

	//
	// JobsQ
	//

	//
	// Postgres
	//
	pg, err := db.Open(*dbDSN)
	if err != nil {
		log.Fatalf("postgres.Open:", err)
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
	// GRPC
	//
	var (
		grpcOpts = []grpc.ServerOption{
			grpc.UnaryInterceptor(grpc_middleware.UnaryChain(unaryMiddleware...)),
			grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
		}

		svc = &campaigns_grpc.Server{
			DB: pg,
		}
		srv = grpc.NewServer(grpcOpts...)
	)

	go func() {
		campaigns_grpc.Register(srv, svc)

		log.Infof("proto=rpc address=%q", *rpcAddr)

		lis, err := net.Listen("tcp", *rpcAddr)
		if err != nil {
			log.Fatalf("grpc: net.Listen: %v", err)
		}

		if err := srv.Serve(lis); err != nil {
			log.Fatalf("grpc.Serve: %v", err)
		}
	}()

	//
	// HTTP
	//
	go func() {
		// measure latency distributions of your RPCs
		grpc_prometheus.EnableHandlingTimeHistogram()

		log := log.WithFields(rlog.Fields{"probe": ""})

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", rhttp.ProbeChain(ctx, log, readinessProbes...))
		http.Handle("/liveness", rhttp.ProbeChain(ctx, log, livenessProbes...))

		var hsrv = http.Server{
			Addr: *httpAddr,
			// ErrorLog:     stderr,
			Handler:      http.DefaultServeMux,
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
		}

		log.Infof("proto=http address=%q", *httpAddr)

		hl, err := net.Listen("tcp", *httpAddr)
		if err != nil {
			log.Fatalf("http: net.Listen: %v", err)
		}

		if err := hsrv.Serve(hl); err != nil {
			log.Infof("http.Serve: %v", err)
		}
	}()

	//
	// Signals
	//
	sigc := make(chan os.Signal)
	signal.Notify(sigc, syscall.SIGINT, syscall.SIGTERM)

	select {
	case <-ctx.Done():
		log.Infof("status=done")
	case sig := <-sigc:
		log.Infof("status=signal signal=%q", sig)
	}

	srv.GracefulStop()
	log.Infof("status=stopped")
}
