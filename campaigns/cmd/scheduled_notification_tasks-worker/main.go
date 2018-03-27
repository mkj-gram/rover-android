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

	"github.com/jackc/pgx"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"google.golang.org/grpc"

	prom "github.com/prometheus/client_golang/prometheus"

	audiencepb "github.com/roverplatform/rover/apis/go/audience/v1"
	notification "github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/campaigns/db"
	campaignjobs "github.com/roverplatform/rover/campaigns/jobs"
	"github.com/roverplatform/rover/campaigns/que"
	sn "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
)

var (
	//
	// GCP
	//
	gcpProjectId      = flag.String("gcp-project-id", "", "GCP Project ID")
	gcpServiceAcctKey = flag.String("gcp-service-account-key", "", "GCP service account key path")

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
	// Audience Service
	//
	audienceAddr = flag.String("audience-service-url", "", "audience service address")

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

		readiness http.Handler = http.HandlerFunc(statusOk)
		liveness  http.Handler = http.HandlerFunc(statusOk)
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

	prom.MustRegister(jobsErrors)
	prom.MustRegister(jobsPanics)
	prom.MustRegister(jobsStats)

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

	var pgping = func() error {
		_, err := pgpool.ExecEx(ctx, `select 1`, nil)
		if err != nil {
			stderr.Printf("postgres: ping: error=%q\n", err)
		}
		return err
	}

	readiness = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := pgping(); err != nil {
			http.Error(w, err.Error(), http.StatusServiceUnavailable)
			return
		}
		readiness.ServeHTTP(w, r)
	})

	liveness = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := pgping(); err != nil {
			http.Error(w, err.Error(), http.StatusServiceUnavailable)
			return
		}
		liveness.ServeHTTP(w, r)
	})

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

	//
	// worker pool
	var (
		taskc = make(chan *sn.Task)

		snw = campaignjobs.ScheduledNotificationJob{
			AudienceClient: audienceClient,
			CampaignsStore: pgdb.CampaignsStore(),
			NotificationClient: printer(func(ctx context.Context, req *notification.SendCampaignNotificationRequest) (*notification.SendCampaignNotificationResponse, error) {
				log.Printf("notification: %v", req)
				var notification_err error // == do notification
				return &notification.SendCampaignNotificationResponse{}, notification_err
			}),
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
		go func() {
			defer wg.Done()
			worker(i)
		}()
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

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", readiness)
		http.Handle("/liveness", liveness)
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
	case sig := <-sigc:
		stdout.Println("signal=", sig)
	}

	cancelFn()

	stdout.Println("status=waiting_workers")
	wg.Wait()

	stdout.Println("status=stopped")
}

func statusOk(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(r.URL.Path + ":ok\n"))
}

type printer func(context.Context, *notification.SendCampaignNotificationRequest) (*notification.SendCampaignNotificationResponse, error)

func (fn printer) SendCampaignNotification(ctx context.Context, req *notification.SendCampaignNotificationRequest, opts ...grpc.CallOption) (*notification.SendCampaignNotificationResponse, error) {
	return fn(ctx, req)
}
