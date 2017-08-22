package main

import (
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"time"

	mgo "gopkg.in/mgo.v2"

	"github.com/namsral/flag"

	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
	grpc_newrelic "github.com/roverplatform/rover/go/grpc/middleware/newrelic"
	rlog "github.com/roverplatform/rover/go/log"

	"github.com/grpc-ecosystem/go-grpc-prometheus"
	prom "github.com/prometheus/client_golang/prometheus"

	"golang.org/x/net/context"
	_ "golang.org/x/net/trace"

	"google.golang.org/api/option"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/grpclog"

	gerrors "cloud.google.com/go/errors"
	"cloud.google.com/go/trace"
	"github.com/newrelic/go-agent"
)

const (
	newrelicAppName = "Audience Service"
)

var (
	// NOTE: environment variables are just UPPERCASED_NAMES of the flag names
	// ie: TLS, KEY_FILE, DB_DSN, etc
	serviceTLS = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP")
	certFile   = flag.String("cert-file", "cert.pem", "The TLS cert file")
	keyFile    = flag.String("key-file", "server.key", "The TLS key file")

	rpcAddr  = flag.String("rpc-addr", ":5100", "rpc address")
	httpAddr = flag.String("http-addr", ":5080", "http address")

	mongoDSN = flag.String("mongo-dsn", "", "mongo Data Source Name")

	gProjectID = flag.String("google-project-id", "", "google PROJECT_ID")
	gTraceKey  = flag.String("google-trace-key", "", "path to google trace service account key file")

	newRelicKey = flag.String("newrelic-key", "", "New Relic licence key")
)

var (
	stderr  = log.New(os.Stderr, "error: ", 0)
	stdout  = log.New(os.Stdout, "", 0)
	grpcLog = log.New(os.Stdout, "grpclog: ", 0)
)

func main() {
	flag.EnvironmentPrefix = "AUDIENCE_SERVICE"
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	// do not timestamp log entries: GKE does it
	grpclog.SetLogger(grpcLog)

	var ctx, cancelFn = context.WithCancel(context.Background())
	defer cancelFn()

	lis, err := net.Listen("tcp", *rpcAddr)
	if err != nil {
		stderr.Fatalf("net.Listen: %v", err)
	}

	var unaryMiddleware []grpc.UnaryServerInterceptor

	var tc *trace.Client

	if *gProjectID != "" && *gTraceKey != "" {
		var err error
		tc, err = trace.NewClient(ctx, *gProjectID, option.WithServiceAccountFile(*gTraceKey))
		if err != nil {
			stderr.Fatalf("trace.NewClient: %v", err)
		} else {
			// sample every 1000' req not exceeding 5/sec
			p, err := trace.NewLimitedSampler(0.001, 5)
			if err != nil {
				stderr.Fatalln("trace:", err)
			}

			tc.SetSamplingPolicy(p)
			stdout.Println("google.tracing=on")
			unaryMiddleware = append(unaryMiddleware, UnaryTraceInterceptor(tc))
		}

		errClient, err := gerrors.NewClient(ctx, *gProjectID, "audience-service", "v1", true, option.WithServiceAccountFile(*gTraceKey))
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
			grpc_middleware.UnaryLogger,
		}

	}

	if *newRelicKey != "" {
		config := newrelic.NewConfig(newrelicAppName, *newRelicKey)
		app, err := newrelic.NewApplication(config)
		if err != nil {
			stderr.Fatalf("Failed to initialize New Relic: %v", err)
		}

		newrelicMiddleware := grpc_newrelic.UnaryServerInterceptor(app)
		unaryMiddleware = append(unaryMiddleware, newrelicMiddleware)

		stdout.Println("newrelic=on")
	} else {
		stdout.Println("newrelic=off")
	}

	var opts = []grpc.ServerOption{
		grpc.UnaryInterceptor(grpc_middleware.UnaryChain(unaryMiddleware...)),
		grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
	}

	if *serviceTLS {
		creds, err := credentials.NewServerTLSFromFile(*certFile, *keyFile)
		if err != nil {
			stderr.Fatalf("credentials.NewServerTLSFromFile: %v", err)
		}
		opts = append(opts, grpc.Creds(creds))
	}

	sess, mongoInfo := dialMongo(*mongoDSN)
	if err := sess.Ping(); err != nil {
		stderr.Println("sess.Ping:", err)
	}
	defer sess.Close()

	// sess.SetSocketTimeout(10 * time.Second)

	db := mongodb.New(sess.DB(mongoInfo.Database),
		mongodb.WithLogger(rlog.NewLog(rlog.Error)),
		mongodb.WithTimeFunc(time.Now),
	)

	grpcServer := grpc.NewServer(opts...)

	service.Register(grpcServer, service.New(db))

	go func() {
		stdout.Printf("proto=rpc address=%q", *rpcAddr)

		if err := grpcServer.Serve(lis); err != nil {
			stderr.Fatalln("grpc.Serve:", err)
		}
	}()

	go func() {
		// measure latency distributions of your RPCs
		grpc_prometheus.EnableHandlingTimeHistogram()

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", ping(sess, true, tc))
		http.Handle("/liveness", ping(sess, false, tc))

		hsrv := http.Server{
			Addr:     *httpAddr,
			ErrorLog: stderr,
			Handler:  http.DefaultServeMux,
		}

		stdout.Printf("proto=http address=%q", *httpAddr)

		if err := hsrv.ListenAndServe(); err != nil {
			stderr.Fatalln("http.ListenAndServe:", err)
		}
	}()

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt)

	select {
	case sig := <-sigc:
		grpclog.Println("signal:", sig)
	}

	grpcServer.GracefulStop()
	stdout.Println("stopped")
}

// for livelines we're "alway on": k8s shoudn't take pod down because db is down
func ping(sess *mgo.Session, readiness bool, tc *trace.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if tc != nil {
			span := tc.SpanFromRequest(r)
			defer span.Finish()
		}

		nsess := sess.Copy()
		defer nsess.Close()

		if err := nsess.Ping(); err != nil {
			stderr.Println("sess.Ping:", err)
			http.Error(w, "sess.Ping:"+err.Error(), http.StatusServiceUnavailable)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})
}

func UnaryTraceInterceptor(tc *trace.Client) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		span := tc.NewSpan(info.FullMethod)
		defer span.Finish()
		return handler(trace.NewContext(ctx, span), req)
	}
}

func UnaryPanicInterceptor(ec *gerrors.Client) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		defer ec.Catch(ctx, gerrors.Repanic(false))
		return handler(ctx, req)
	}
}

func dialMongo(dsn string) (*mgo.Session, *mgo.DialInfo) {
	dialInfo, err := mongodb.ParseURL(dsn)
	if err != nil {
		stderr.Fatalln("mongodb:", err)
	}

	sess, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		stderr.Fatalf("mgo.Dial: DSN=%q error=%q", dsn, err)
	}

	return sess, dialInfo
}
