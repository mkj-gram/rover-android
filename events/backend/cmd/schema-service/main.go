package main

import (
	"context"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	schema_grpc "github.com/roverplatform/rover/events/backend/grpc/schema"
	"github.com/roverplatform/rover/events/backend/schema"
	grpc_logs "github.com/roverplatform/rover/go/grpc/logs"
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
	rhttp "github.com/roverplatform/rover/go/http"
	"github.com/roverplatform/rover/go/logger"

	"github.com/grpc-ecosystem/go-grpc-prometheus"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"google.golang.org/grpc"
)

var (
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
	log = logger.New()
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
	log.SetLevel(logger.LevelFromString(*logLevel))

	//
	// Postgres
	//
	schemaDB, err := schema.Open(*dbDSN)
	if err != nil {
		log.Fatal(err)
	}

	schemaProbe := func(ctx context.Context) error {
		if err := schemaDB.Ping(); err != nil {
			return errors.Wrap(err, "SchemaDB")
		}

		return nil
	}

	readinessProbes = append(readinessProbes, schemaProbe)
	livenessProbes = append(livenessProbes, schemaProbe)

	//
	// GRPC
	//
	var (
		grpcOpts = []grpc.ServerOption{
			grpc.UnaryInterceptor(grpc_middleware.UnaryChain(unaryMiddleware...)),
			grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
		}

		grpcServer = grpc.NewServer(grpcOpts...)
	)

	go func() {
		var server = schema_grpc.NewServer(schemaDB)
		server.Register(grpcServer)

		lis, err := net.Listen("tcp", *rpcAddr)
		if err != nil {
			log.Fatalf("net.Listen: %v", err)
		}

		log.Infof("proto=rcp address=%q", *rpcAddr)
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("schema_grpc.ListenAndServe: %v", err)
		}
	}()

	////
	// HTTP
	//
	go func() {
		// measure latency distributions of your RPCs
		grpc_prometheus.EnableHandlingTimeHistogram()

		log := log.WithFields(logger.Fields{"probe": ""})

		http.Handle("/metrics", prometheus.Handler())
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

	grpcServer.GracefulStop()
	log.Info("status=stopped")
}
