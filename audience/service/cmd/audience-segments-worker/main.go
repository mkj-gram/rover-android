package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"strings"
	"time"

	"golang.org/x/net/context"
	_ "golang.org/x/net/trace"
	"google.golang.org/api/option"

	audience_elastic "github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/audience/service/worker"
	rlog "github.com/roverplatform/rover/go/log"
	loghttp "github.com/roverplatform/rover/go/log/http"

	mgo "gopkg.in/mgo.v2"
	elastic "gopkg.in/olivere/elastic.v5"

	"github.com/namsral/flag"

	"github.com/grpc-ecosystem/go-grpc-prometheus"
	prom "github.com/prometheus/client_golang/prometheus"

	"cloud.google.com/go/pubsub"
	"cloud.google.com/go/trace"

	"github.com/newrelic/go-agent"

	gerrors "cloud.google.com/go/errors"
)

const (
	projectName     = "Segments Worker"
	newrelicAppName = projectName
)

var (
	// NOTE: environment variables are just UPPERCASED_NAMES of the flag names
	// ie: TLS, KEY_FILE, DB_DSN, etc
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// Mongo
	mongoDSN = flag.String("mongo-dsn", "", "mongo Data Source Name")

	// ES
	esDSN = flag.String("elastic-dsn", "", "Elastic Search DSN: comma separated list of URLs")

	// Newrelic
	newRelicKey = flag.String("newrelic-key", "", "New Relic licence key")

	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	// GCP PubSub
	pubsubSubcription            = flag.String("pubsub-subscription", "audience-service-updates-segments-worker", "GCP pubsub's subscription name")
	pubSubMaxOutstandingMessages = flag.Int("pubsub-max-outstanding-messages", 1, "number of batches allowed to be processed in parallel")
)

var (
	stderr = log.New(os.Stderr, "error: ", 0)
	stdout = log.New(os.Stdout, "", 0)
	rLog   = rlog.New(rlog.Error)

	verboseLog = log.New(ioutil.Discard, "", 0)
)

type (
	WorkHandler func(context.Context, *pubsub.Message) error
)

func main() {
	flag.EnvironmentPrefix = "SEGMENTS_WORKER"
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	var (
		runTests  http.Handler = http.HandlerFunc(statusOk)
		readiness http.Handler = http.HandlerFunc(statusOk)
		liveness  http.Handler = http.HandlerFunc(statusOk)

		workHandler WorkHandler

		ctx, cancelFn = context.WithCancel(context.Background())
	)

	defer cancelFn()

	//
	//  Mongo
	//

	mgo.SetLogger(verboseLog)
	mgo.SetStats(true)
	mgo.SetDebug(false)

	sess, mongoInfo := dialMongo(*mongoDSN)
	if err := sess.Ping(); err != nil {
		stderr.Println("sess.Ping:", err)
	}
	defer sess.Close()

	sess.SetMode(mgo.SecondaryPreferred, false)

	readiness = ping(sess, readiness)
	liveness = ping(sess, liveness)

	//
	// Elastic
	//
	var urls = strings.Split(*esDSN, ",")
	if len(urls) == 0 {
		stderr.Fatalln("`elastic-dsn` is required")
	}

	var u, p, err = audience_elastic.UserInfo(urls[0])
	if err != nil {
		stderr.Fatalln("elastic.UserInfo:", err)
	}
	urls, err = audience_elastic.StripUserInfo(urls...)
	if err != nil {
		stderr.Fatalln("elastic.StripUserInfo:", err)
	}

	esClient, err := elastic.NewClient(
		elastic.SetURL(urls...),
		elastic.SetBasicAuth(u, p),
		elastic.SetErrorLog(stderr),
		elastic.SetInfoLog(verboseLog),
		elastic.SetTraceLog(verboseLog),
		elastic.SetMaxRetries(0),
		elastic.SetSniff(false),
		// es.SetSnifferInterval(t.snifferInterval),
		// es.SetHealthcheck(t.healthcheck),
		// es.SetHealthcheckInterval(t.healthcheckInterval))
	)
	if err != nil {
		stderr.Fatalln("elastic:", err)
	}

	//
	// worker
	//

	wServer := &worker.Worker{
		Log:          rLog,
		DB:           sess.DB(mongoInfo.Database),
		Bulk:         &audience_elastic.BulkHandler{Client: esClient},
		AccountIndex: audience_elastic.AccountIndex,
	}

	workHandler = func(ctx context.Context, msg *pubsub.Message) error {
		started := time.Now()
		verboseLog.Printf("worker: pubsub.id=%s\n", msg.ID)
		err := wServer.Handle(ctx, msg)
		dur := time.Now().Sub(started)
		if err != nil {
			stderr.Printf("worker: pubsub.id=%s dur=%v status=error error=%q\n", msg.ID, dur, err)
		} else {
			verboseLog.Printf("worker: pubsub.id=%s dur=%v status=OK\n", msg.ID, dur)
		}
		return err
	}

	//
	// NewRelic
	//
	if *newRelicKey != "" {
		config := newrelic.NewConfig(newrelicAppName, *newRelicKey)
		app, err := newrelic.NewApplication(config)
		if err != nil {
			stderr.Fatalf("Failed to initialize New Relic: %v", err)
		}

		app.RecordCustomEvent("segments-worker/started", nil)
		defer app.Shutdown(time.Second * 10)

		workHandler = func(h WorkHandler) WorkHandler {
			return func(ctx context.Context, msg *pubsub.Message) error {
				t := app.StartTransaction("segments-worker/work/pubsub", nil, nil)
				t.AddAttribute("pubsub.ID", msg.ID)
				t.AddAttribute("pubsub.Subscription", *pubsubSubcription)
				t.AddAttribute("pubsub.PublishTime", msg.PublishTime.Format(time.RFC3339))
				defer t.End()

				if err := h(ctx, msg); err != nil {
					t.NoticeError(err)
					return err
				}
				return nil
			}
		}(workHandler)

		stdout.Println("newrelic=on")
	} else {
		stdout.Println("newrelic=off")
	}

	//
	// GCP
	//
	if *gcpProjectID != "" {
		var (
			err          error
			traceClient  *trace.Client
			errClient    *gerrors.Client
			pubsubClient *pubsub.Client
			pubSubOpts   []option.ClientOption
		)

		if *gcpSvcAcctKeyPath != "" {
			traceClient, err = trace.NewClient(ctx, *gcpProjectID, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
			if err != nil {
				stderr.Fatalf("trace.NewClient: %v", err)
			}

			stdout.Println("gcp.tracing=on")

			errClient, err = gerrors.NewClient(ctx, *gcpProjectID, projectName, "v1", true, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
			if err != nil {
				stderr.Fatalf("errors.NewClient: %v", err)
			}
			runTests = func(h http.Handler) http.Handler {
				return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					h.ServeHTTP(w, r)
					errClient.Report(r.Context(), r, r.URL.Path)
				})
			}(runTests)

			stdout.Println("gcp.errors=on")

			pubSubOpts = append(pubSubOpts, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
		} else {
			stdout.Println("gcp.errors=off")
			stdout.Println("gcp.tracing=off")
		}

		pubsubClient, err = pubsub.NewClient(ctx, *gcpProjectID, pubSubOpts...)
		if err != nil {
			stderr.Fatalf("pubsub.NewClient: %v", err)
		} else {
			stdout.Println("gcp.pubsub=on")
		}

		pubsub.DefaultReceiveSettings = pubsub.ReceiveSettings{
			MaxExtension:           10 * time.Minute,
			MaxOutstandingMessages: *pubSubMaxOutstandingMessages,
			MaxOutstandingBytes:    1e9, // 1G
			NumGoroutines:          10,
		}

		sub := pubsubClient.Subscription(*pubsubSubcription)

		workHandler = func(h WorkHandler) WorkHandler {
			return func(ctx context.Context, msg *pubsub.Message) error {
				if errClient != nil {
					errClient.Catch(ctx, gerrors.Repanic(false))
				}
				if traceClient != nil {
					span := traceClient.NewSpan("segments-worker/work/pubsub")
					defer span.Finish()
					span.SetLabel("pubsub.Subscription", *pubsubSubcription)
					span.SetLabel("pubsub.ID", msg.ID)
					span.SetLabel("pubsub.PublishTime", msg.PublishTime.Format(time.RFC3339))
				}

				err := h(ctx, msg)
				if err != nil && errClient != nil {
					errClient.Reportf(ctx, nil, "worker: pubsub.id=%s error=%v", msg.ID, err)
				}
				return err
			}
		}(workHandler)

		go func() {
			stdout.Println("pubsub.receive=starting")
			work := func(ctx context.Context, msg *pubsub.Message) {
				if err := workHandler(ctx, msg); err != nil {
					msg.Nack()
				} else {
					msg.Ack()
				}
			}
			if err := sub.Receive(ctx, work); err != nil {
				errClient.Reportf(ctx, nil, "pubsub.receive: error=%q", err)
				stderr.Fatalf("pubsub.receive: status=error error=%q\n", err)
			} else {
				stdout.Printf("pubsub.receive=exiting status=OK\n")
			}
		}()
	} else {
		stdout.Println("gcp.errors=off")
		stdout.Println("gcp.tracing=off")
		stdout.Println("gcp.pubsub=off")
	}

	//
	// Http Server
	//
	go func() {
		// measure latency distributions of RPCs
		grpc_prometheus.EnableHandlingTimeHistogram()

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", readiness)
		http.Handle("/liveness", liveness)
		http.Handle("/runtests", runTests)
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
