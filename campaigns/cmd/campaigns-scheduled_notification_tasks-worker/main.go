package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	gerrors "cloud.google.com/go/errors"
	"github.com/jackc/pgx"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"google.golang.org/api/option"
	"google.golang.org/grpc"

	prom "github.com/prometheus/client_golang/prometheus"

	audiencepb "github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/campaigns/db"
	campaignjobs "github.com/roverplatform/rover/campaigns/jobs"
	"github.com/roverplatform/rover/campaigns/que"
	sn "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
)

var (
	//
	// GCP
	//
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP Project ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	//
	// Queue
	//
	queNWrokers      = flag.Int("que-nworkers", 10, "worker pool size")
	queSleepDuration = flag.Duration("que-sleep-duration", time.Duration(5*time.Second), "worker's sleep duration sleep duration")

	//
	// Postgres
	//
	dbDSN = flag.String("db-dsn", "", "Postgres DSN url")

	//
	// GRPC Services
	//
	audienceAddr     = flag.String("audience-service-url", "", "audience service address")
	notificationAddr = flag.String("notification-service-url", "", "notification service address")

	//
	// Listeners
	//
	httpAddr = flag.String("http-addr", ":5080", "http address")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())

		livenessProbes, readinessProbes []func(context.Context) error
	)

	defer cancelFn()

	//
	// Prometheus metrics
	//

	var (
		jobsErrors = prom.NewCounter(prom.CounterOpts{
			Name: "schedueled_notification_tasks_errors",
			Help: "number of jobs error-ed",
		})

		jobsPanics = prom.NewCounter(prom.CounterOpts{
			Name: "schedueled_notification_tasks_panics",
			Help: "number of jobs panic-ed",
		})

		jobsStats = prom.NewSummary(prom.SummaryOpts{
			Name: "schedueled_notification_tasks",
			Help: "summary(duration and count) of jobs processed",
		})
	)

	prom.MustRegister(jobsErrors, jobsPanics, jobsStats)

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

	var errClient *gerrors.Client

	if *gcpProjectID != "" {
		var err error
		errClient, err = gerrors.NewClient(ctx, *gcpProjectID, "notification/push-worker", "v1", true, gcpClientOpts...)
		if err != nil {
			stderr.Fatalf("errors.NewClient: %v", err)
		} else {
			stdout.Println("gcp.errors=on")
		}
	}

	//
	// pgx Postgres
	//
	//

	pgxcfg, err := pgx.ParseURI(*dbDSN)
	if err != nil {
		stderr.Fatalln("pgx.ParseURI:", err)
	}

	pgpool, err := pgx.NewConnPool(pgx.ConnPoolConfig{
		ConnConfig: pgxcfg,
		// AfterConnect: PrepareStatements,
	})

	if err != nil {
		stderr.Fatalln("pgx.NewConnPool:", err)
	}

	defer pgpool.Close()

	var pgping = func(ctx context.Context) error {
		_, err := pgpool.ExecEx(ctx, `select 1`, nil)
		if err != nil {
			stderr.Printf("postgres: ping: error=%q\n", err)
		}
		return err
	}

	readinessProbes = append(readinessProbes, pgping)

	//
	// Scheduled Notification Worker
	//

	//
	// DB API
	//

	pgdb, err := db.Open(*dbDSN)
	if err != nil {
		stderr.Fatalln("db.Open:", err)
	}

	//
	// audienceClient
	//

	conn, err := grpc.Dial(*audienceAddr, grpc.WithInsecure())
	if err != nil {
		stderr.Fatalln("grpc.Dial:", err)
	}
	defer conn.Close()

	audienceClient := audiencepb.NewAudienceClient(conn)

	nconn, err := grpc.Dial(*notificationAddr, grpc.WithInsecure())
	if err != nil {
		stderr.Fatalln("grpc.Dial:", err)
	}
	defer nconn.Close()

	notificationClient := notification.NewNotificationClient(nconn)

	//
	// worker pool
	var (
		taskc = make(chan *sn.Task)

		snw = campaignjobs.ScheduledNotificationJob{
			AudienceClient:     audienceClient,
			CampaignsStore:     pgdb.CampaignsStore(),
			NotificationClient: notificationClient,
		}

		worker = func(n int) {
			var wn = fmt.Sprintf("worker: worker_id=%d", n)
			for {
				select {
				case <-ctx.Done():
					stdout.Println(wn, "stopping")
					return
				case task := <-taskc:

					// function call is required for defers to fire after
					func() {
						// release task PG's lock eventually
						defer task.Done()

						// Recover any panics and log/update task.Error
						defer que.Recover(func(val interface{}, stacktrace string) {
							jobsPanics.Inc()
							stderr.Printf("%s job_id=%d status=panic stacktrace=%q", wn, task.ID, stacktrace)

							if errClient != nil {
								errClient.Reportf(ctx, nil, "%s job_id=%d status=panic stacktrace=%q", wn, task.ID, stacktrace)
							}
						})

						stdout.Printf("%s job_id=%d status=starting\n", wn, task.ID)

						start := time.Now()
						// work
						err := snw.Do(ctx, task)
						dur := time.Now().Sub(start)

						if err != nil {
							jobsErrors.Inc()
							stderr.Printf("%s job_id=%d dur=%v status=error error=%q\n", wn, task.ID, dur, err)
						} else {
							stdout.Printf("%s job_id=%d dur=%v status=OK \n", wn, task.ID, dur)
						}

						jobsStats.Observe(float64(dur / time.Second))
					}()
				}
			}
		}

		poller = func() {
			var count int
			for {
				select {
				case <-ctx.Done():
					stdout.Println("poller: stopping")
					return
				default:
				}

				task, err := sn.LockOne(pgpool)
				if err != nil {
					stderr.Printf("poller: status=error error=%q\n", errors.Wrap(err, "LockOne"))
					time.Sleep(*queSleepDuration)
					continue
				}
				if task == nil {
					stdout.Printf("poller: status=idling for=%v dispatched=%d\n", queSleepDuration, count)
					if count > 0 {
						count = 0
					}
					time.Sleep(*queSleepDuration)
					continue
				}

				count += 1
				taskc <- task
			}
		}

		wg sync.WaitGroup
	)

	if err := sn.PrepareStatements(pgpool); err != nil {
		stderr.Fatalln("PrepareStatements:", err)
	}

	wg.Add(*queNWrokers)

	for i := 0; i < *queNWrokers; i++ {
		go func(n int) {
			defer wg.Done()
			worker(n)
		}(i)
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		poller()
	}()

	stdout.Println("workerpool=started")
	stdout.Println("poller=started")

	//
	// HTTP endpoints
	//
	go func() {
		// measure latency distributions of your RPCs
		// grpc_prometheus.EnableHandlingTimeHistogram()
		probe := func(probes []func(context.Context) error) http.HandlerFunc {
			return func(w http.ResponseWriter, r *http.Request) {
				var result string
				for _, probe := range probes {
					if err := probe(ctx); err != nil {
						stderr.Printf("probe: %v\n", err)
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
		http.Handle("/readiness", probe(readinessProbes))
		http.Handle("/liveness", probe(livenessProbes))
		// http.Handle("/togglelogs", loghttp.ToggleLogs(ioutil.Discard, os.Stdout, verboseLog))

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
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	stdout.Println("status=waiting_for_signal")
	select {
	case <-ctx.Done():
	case sig := <-sigc:
		stdout.Printf("signal=%v\n", sig)
		cancelFn()
	}

	stdout.Println("status=waiting_workers")
	wg.Wait()
	stdout.Println("status=stopped")
}

func statusOk(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(r.URL.Path + ":ok\n"))
}
