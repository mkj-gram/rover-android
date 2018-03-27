package main

import (
	"database/sql"
	"log"
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

	"github.com/namsral/flag"

	"github.com/grpc-ecosystem/go-grpc-prometheus"
	prom "github.com/prometheus/client_golang/prometheus"

	gerrors "cloud.google.com/go/errors"
	"google.golang.org/api/option"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/grpclog"

	"github.com/roverplatform/rover/campaigns/db"
	campaigns_grpc "github.com/roverplatform/rover/campaigns/grpc"
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
)

var (
	// NOTE: environment variables are just UPPERCASED_NAMES of the flag names
	// ie: TLS, KEY_FILE, DB_DSN, etc
	tls      = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP")
	certFile = flag.String("cert-file", "cert.pem", "The TLS cert file")
	keyFile  = flag.String("key-file", "server.key", "The TLS key file")

	//
	// Postgres
	//
	dbDSN = flag.String("db-dsn", "", "Postgres DSN url")

	//
	// Listeners
	//
	rpcAddr  = flag.String("rpc-addr", ":5100", "The server port")
	httpAddr = flag.String("http-addr", ":5080", "http address")

	//
	// GCP
	//
	gcpProjectId      = flag.String("gcp-project-id", "", "GCP Project ID")
	gcpServiceAcctKey = flag.String("gcp-service-account-key", "", "GCP service account key path")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)
)

func main() {
	flag.Parse()

	// do not timestamp log entries: GKE does it
	grpclog.SetLogger(stdout)

	var ctx, cancelFn = context.WithCancel(context.Background())
	defer cancelFn()

	var unaryMiddleware []grpc.UnaryServerInterceptor

	if *gcpProjectId != "" && *gcpServiceAcctKey != "" {
		var err error

		errClient, err := gerrors.NewClient(ctx, *gcpProjectId, "campaigns/service", "v1", true, option.WithServiceAccountFile(*gcpServiceAcctKey))
		if err != nil {
			stderr.Fatalf("errors.NewClient: %v", err)
		} else {
			stdout.Println("google.errors=on")
			unaryMiddleware = append(unaryMiddleware, UnaryPanicInterceptor(errClient))
		}

	} else {
		stdout.Println("google.errors=off")
		stdout.Println("google.tracing=off")

		unaryMiddleware = []grpc.UnaryServerInterceptor{
			grpc_prometheus.UnaryServerInterceptor,
			grpc_middleware.UnaryPanicRecovery(grpc_middleware.DefaultPanicHandler),
			grpc_middleware.UnaryLog(stdout),
		}
	}

	var opts = []grpc.ServerOption{
		grpc.UnaryInterceptor(grpc_middleware.UnaryChain(unaryMiddleware...)),
		grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
	}

	if *tls {
		creds, err := credentials.NewServerTLSFromFile(*certFile, *keyFile)
		if err != nil {
			stderr.Fatalf("credentials.NewServerTLSFromFile: %v", err)
		}
		opts = append(opts, grpc.Creds(creds))
	}

	//
	// JobsQ
	//

	//
	// Postgres
	//
	pgdb, err := db.Open(*dbDSN)
	if err != nil {
		stderr.Fatalln("postgres.Open:", err)
	}
	defer pgdb.Close()

	//
	// Service
	//
	var (
		svc = &campaigns_grpc.Server{
			DB: pgdb,
		}
		srv = grpc.NewServer(opts...)
	)

	go func() {
		campaigns_grpc.Register(srv, svc)

		stdout.Printf("proto=rpc address=%q", *rpcAddr)

		lis, err := net.Listen("tcp", *rpcAddr)
		if err != nil {
			stderr.Fatalf("grpc: net.Listen: %v", err)
		}

		if err := srv.Serve(lis); err != nil {
			stderr.Fatalln("grpc.Serve:", err)
		}
	}()

	//
	// HTTP
	//
	go func() {
		// measure latency distributions of your RPCs
		grpc_prometheus.EnableHandlingTimeHistogram()

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", ping(pgdb.DB(), true))
		http.Handle("/liveness", ping(pgdb.DB(), false))

		var hsrv = http.Server{
			Addr:         *httpAddr,
			ErrorLog:     stderr,
			Handler:      http.DefaultServeMux,
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
		}

		stdout.Printf("proto=http address=%q", *httpAddr)

		hl, err := net.Listen("tcp", *httpAddr)
		if err != nil {
			stderr.Fatalf("http: net.Listen: %v", err)
		}

		if err := hsrv.Serve(hl); err != nil {
			stderr.Fatalln("http.Serve:", err)
		}
	}()

	//
	// Signals
	//
	sigc := make(chan os.Signal)
	signal.Notify(sigc, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-sigc:
		stdout.Println("signal:", sig)
	}

	srv.GracefulStop()
	stdout.Println("stopped")
}

// for livelines we're "alway on": k8s shoudn't take pod down because db is down
func ping(db *sql.DB, readiness bool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := db.PingContext(r.Context()); err != nil {
			stderr.Println("db.Ping:", err)
			if readiness {
				http.Error(w, "db.Ping:"+err.Error(), http.StatusServiceUnavailable)
				return
			}
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})
}

func UnaryPanicInterceptor(ec *gerrors.Client) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		defer ec.Catch(ctx, gerrors.Repanic(false))
		return handler(ctx, req)
	}
}
