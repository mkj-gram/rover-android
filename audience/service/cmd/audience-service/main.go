package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"sync"
	"time"

	mgo "gopkg.in/mgo.v2"

	"github.com/namsral/flag"

	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
	spubsub "github.com/roverplatform/rover/audience/service/pubsub"

	grpc_middleware "github.com/roverplatform/rover/go/grpc/middleware"
	grpc_newrelic "github.com/roverplatform/rover/go/grpc/middleware/newrelic"
	rlog "github.com/roverplatform/rover/go/log"
	loghttp "github.com/roverplatform/rover/go/log/http"

	"github.com/grpc-ecosystem/go-grpc-prometheus"
	prom "github.com/prometheus/client_golang/prometheus"

	"golang.org/x/net/context"
	_ "golang.org/x/net/trace"

	"google.golang.org/api/option"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/grpclog"

	gerrors "cloud.google.com/go/errors"
	"cloud.google.com/go/pubsub"
	"cloud.google.com/go/trace"
	"github.com/newrelic/go-agent"
)

const (
	newrelicAppName = "Audience Service"
)

var (
	// NOTE: environment variables are just UPPERCASED_NAMES of the flag names
	// ie: TLS, KEY_FILE, MONGO_DSN, etc

	// TLS
	serviceTLS = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP")
	certFile   = flag.String("cert-file", "cert.pem", "The TLS cert file")
	keyFile    = flag.String("key-file", "server.key", "The TLS key file")

	//  network
	rpcAddr  = flag.String("rpc-addr", ":5100", "rpc address")
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// MongoDB
	mongoDSN = flag.String("mongo-dsn", "", "mongo Data Source Name")

	// GCP Cloud
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to service GCP's account key")

	// GCP PubSub
	topicName = flag.String("pubsub-topic-name", "audience-service-updates", "pubsub's topic name to push updates to")
	NWorkers  = flag.Int("pubsub-nworkers", 10, "number of pubsub's push workers")

	// Notifier
	notifierFlushInterval = flag.Duration("notifier-flush-interval", 30*time.Second, "batch flush interval")
	notifierBatchSize     = flag.Int("notifier-batch-size", 1000, "batch size flush threshold")

	// NewRelic
	newRelicKey = flag.String("newrelic-key", "", "New Relic licence key")
)

var (
	// Logs
	stderr   = log.New(os.Stderr, "error: ", 0)
	stdout   = log.New(os.Stdout, "", 0)
	grpcLog  = log.New(os.Stdout, "grpclog: ", 0)
	roverLog = rlog.NewLog(rlog.Error)

	verboseLog = log.New(ioutil.Discard, "", 0)
)

type PublishWrapper func(spubsub.Publisher) spubsub.Publisher

func main() {
	flag.EnvironmentPrefix = "AUDIENCE_SERVICE"
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	var (
		readiness http.Handler = http.HandlerFunc(statusOk)
		liveness  http.Handler = http.HandlerFunc(statusOk)

		pubWg sync.WaitGroup

		publishWrapper PublishWrapper = func(p spubsub.Publisher) spubsub.Publisher {
			return p
		}

		notifier service.Notifier

		ctx, cancelFn = context.WithCancel(context.Background())

		unaryMiddleware = []grpc.UnaryServerInterceptor{
			grpc_prometheus.UnaryServerInterceptor,
			grpc_middleware.UnaryLog(verboseLog),
		}
	)

	defer cancelFn()

	//
	// NewRelic
	//
	if *newRelicKey != "" {
		config := newrelic.NewConfig(newrelicAppName, *newRelicKey)
		app, err := newrelic.NewApplication(config)
		if err != nil {
			stderr.Fatalf("Failed to initialize New Relic: %v", err)
		}

		app.RecordCustomEvent("audience-service:started", nil)
		defer app.Shutdown(time.Second * 10)

		unaryMiddleware = append(unaryMiddleware, grpc_newrelic.UnaryServerInterceptor(app))

		stdout.Println("newrelic=on")
	} else {
		stdout.Println("newrelic=off")
	}

	//
	// GCP
	//
	if *gcpProjectID != "" && *gcpSvcAcctKeyPath != "" {
		var err error
		//
		// GCP tracing
		//

		tc, err := trace.NewClient(ctx, *gcpProjectID, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
		if err != nil {
			stderr.Fatalf("trace.NewClient: %v", err)
		} else {
			stdout.Println("gcp.tracing=on")
			unaryMiddleware = append(unaryMiddleware, traceUnaryInterceptor(tc))
		}

		//
		// GCP errors
		//

		errClient, err := gerrors.NewClient(ctx, *gcpProjectID, "audience-service", "v1", true, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
		if err != nil {
			stderr.Fatalf("errors.NewClient: %v", err)
		} else {
			stdout.Println("gcp.errors=on")
			unaryMiddleware = append(unaryMiddleware, panicUnaryInterceptor(errClient))
		}

		//
		// GCP pubsub
		//

		pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
		if err != nil {
			log.Fatalf("pubsub.NewClient: %v", err)
		} else {
			stdout.Println("gcp.pubsub=on")
		}

		topic := pubsubClient.Topic(*topicName)
		defer topic.Stop()
		defer pubsubClient.Close()

		topic.PublishSettings = pubsub.PublishSettings{
			Timeout:        60 * time.Second,
			DelayThreshold: 500 * time.Millisecond,
			CountThreshold: 100,
			ByteThreshold:  1e6,
			// defaults to number of cores
			// NumGoroutines: 10,
		}

		_notifier := &spubsub.Notifier{
			// notification channel
			Batchc: make(chan service.Message, 10000),
			// publish channel
			Pubc:          make(chan []service.Message, 1000),
			FlushInterval: *notifierFlushInterval,
			BatchSize:     *notifierBatchSize,
			NWorkers:      *NWorkers,
			Log:           roverLog,
		}
		notifier = _notifier

		var publisher spubsub.Publisher = spubsub.TopicPublisher(topic)

		publishWrapper = func(pw PublishWrapper) PublishWrapper {
			return func(pub spubsub.Publisher) spubsub.Publisher {
				pub = pw(pub)
				return spubsub.PublisherFunc(func(ctx context.Context, msgs []service.Message) (string, error) {
					span := tc.NewSpan("audience-service/push/pubsub")
					span.SetLabel("batch.size", fmt.Sprintf("%d", len(msgs)))
					span.SetLabel("pubsub.Topic", *topicName)
					defer span.Finish()
					verboseLog.Printf("pubsub: batch.size=%d: push", len(msgs))
					id, err := pub.Publish(ctx, msgs)
					span.SetLabel("pubsub.ID", id)
					if err != nil {
						stderr.Printf("pubsub: pubsub.id=%v status=error error=%v", id, err)
						errClient.Reportf(ctx, nil, "pubsub: status=error error=%v", err)
					} else {
						verboseLog.Printf("pubsub: pubsub.id=%v status=OK", id)
					}
					return id, err
				})
			}
		}(publishWrapper)

		go _notifier.Listen(ctx)

		go func() {
			stdout.Println("pubsub.publish=starting")
			_notifier.Publish(ctx, publishWrapper(publisher))
			stdout.Println("pubsub.publish=exited")
		}()

	} else {
		//
		// Local env
		//
		stdout.Println("gcp.errors=off")
		stdout.Println("gcp.tracing=off")
		stdout.Println("gcp.pubsub=off")

		// development mode just logs notifications
		notifier = service.FuncNotifier(func(ctx context.Context, msg service.Message) error {
			stdout.Printf("%+v\n", msg)
			return nil
		})
	}

	//
	// GRPC
	//

	var (
		grpcServerOpts = []grpc.ServerOption{
			grpc.UnaryInterceptor(grpc_middleware.UnaryChain(unaryMiddleware...)),
			grpc.StreamInterceptor(grpc_prometheus.StreamServerInterceptor),
		}
	)

	if *serviceTLS {
		creds, err := credentials.NewServerTLSFromFile(*certFile, *keyFile)
		if err != nil {
			stderr.Fatalf("credentials.NewServerTLSFromFile: %v", err)
		}
		grpcServerOpts = append(grpcServerOpts, grpc.Creds(creds))
	}

	var grpcServer = grpc.NewServer(grpcServerOpts...)

	go func() {
		grpclog.SetLogger(grpcLog)

		lis, err := net.Listen("tcp", *rpcAddr)
		if err != nil {
			stderr.Fatalf("net.Listen: %v", err)
		}

		stdout.Printf("proto=rpc address=%q", *rpcAddr)

		if err := grpcServer.Serve(lis); err != nil {
			stderr.Fatalln("grpc.Serve:", err)
		}
	}()

	//
	// Mongodb
	//

	sess, mongoInfo := dialMongo(*mongoDSN)
	if err := sess.Ping(); err != nil {
		stderr.Println("sess.Ping:", err)
	}
	defer sess.Close()
	mgo.SetStats(true)
	mgo.SetLogger(verboseLog)

	readiness = ping(sess, readiness)
	liveness = ping(sess, liveness)

	// In practice, the Monotonic mode is obtained by performing initial reads on a
	// unique connection to an arbitrary secondary, if one is available, and once the
	// first write happens, the session connection is switched over to the primary
	// server. This manages to distribute some of the reading load with secondaries,
	// while maintaining some useful guarantees.
	sess.SetMode(mgo.Monotonic, false)

	// sess.SetSocketTimeout(10 * time.Second)

	//
	// Audience Service
	//

	var (
		db = mongodb.New(sess.DB(mongoInfo.Database),
			mongodb.WithLogger(roverLog),
			mongodb.WithTimeFunc(time.Now))

		audienceService = service.New(db, notifier)
	)

	//
	// GRPC Service
	//

	service.Register(grpcServer, audienceService)

	//
	// HTTP endpoints
	//

	go func() {
		// measure latency distributions of your RPCs
		grpc_prometheus.EnableHandlingTimeHistogram()

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", readiness)
		http.Handle("/liveness", liveness)
		http.Handle("/togglelogs", loghttp.ToggleLogs(ioutil.Discard, os.Stdout, verboseLog))

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

	//
	// Signals
	//
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt)

	select {
	case sig := <-sigc:
		stdout.Println("signal:", sig)
	}

	grpcServer.GracefulStop()
	stdout.Println("waiting for publisher")
	pubWg.Wait()
	stdout.Println("stopped")
}

func ping(sess *mgo.Session, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		nsess := sess.Copy()
		defer nsess.Close()

		if err := nsess.Ping(); err != nil {
			stderr.Println("sess.Ping:", err)
			http.Error(w, "sess.Ping:"+err.Error(), http.StatusServiceUnavailable)
		} else {
			h.ServeHTTP(w, r)
		}

		fmt.Fprintf(w, "MongoStats: %+v\n", mgo.GetStats())
	})
}

func traceUnaryInterceptor(tc *trace.Client) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		span := tc.NewSpan(info.FullMethod)
		defer span.Finish()
		return handler(trace.NewContext(ctx, span), req)
	}
}

func panicUnaryInterceptor(ec *gerrors.Client) grpc.UnaryServerInterceptor {
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

func statusOk(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(r.URL.Path + ":ok\n"))
}
