package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"runtime"
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
	log = rlog.New()
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())

		livenessProbes, readinessProbes []rhttp.ProbeFunc
	)

	defer cancelFn()

	//
	// Logs
	//
	log.SetLevel(rlog.LevelFromString(*logLevel))

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
	if *gcpSvcAcctKeyPath != "" {
		var err error
		errClient, err = gerrors.NewClient(ctx, *gcpProjectId, "campaigns/service", "v1", true, gcpClientOpts...)
		if err != nil {
			log.Fatalf("errors.NewClient: %v", err)
		}
	} else {
		log.Infof("google.errors=off")
	}

	//
	// pgx Postgres
	//
	//

	pgxcfg, err := pgx.ParseURI(*dbDSN)
	if err != nil {
		log.Fatalf("pgx.ParseURI: %v", err)
	}

	pgpool, err := pgx.NewConnPool(pgx.ConnPoolConfig{
		ConnConfig: pgxcfg,
		// AfterConnect: PrepareStatements,
	})
	if err != nil {
		log.Fatalf("pgx.NewConnPool: %v", err)
	}
	defer pgpool.Close()

	var pgping = func(ctx context.Context) error {
		_, err := pgpool.ExecEx(ctx, `select 1`, nil)
		return errors.Wrap(err, "postgres")
	}

	readinessProbes = append(readinessProbes, pgping)
	livenessProbes = append(livenessProbes, pgping)

	//
	// Scheduled Notification Worker
	//

	//
	// DB API
	//

	pg, err := db.Open(*dbDSN)
	if err != nil {
		log.Fatalf("db.Open: %v", err)
	}
	defer pg.Close()

	//
	// audienceClient
	//

	var (
		clientOpts = []grpc.DialOption{
			grpc.WithUnaryInterceptor(grpc.UnaryClientInterceptor(Logger(log))),
			grpc.WithInsecure(),
		}
	)

	conn, err := grpc.Dial(*audienceAddr, clientOpts...)
	if err != nil {
		log.Fatalf("grpc.Dial: %v", err)
	}
	defer conn.Close()

	audienceClient := audiencepb.NewAudienceClient(conn)

	nconn, err := grpc.Dial(*notificationAddr, clientOpts...)
	if err != nil {
		log.Fatalf("grpc.Dial:", err)
	}
	defer nconn.Close()

	notificationClient := notification.NewNotificationClient(nconn)

	//
	// worker pool
	var (
		taskc = make(chan *sn.Task)

		snw = campaignjobs.ScheduledNotificationJob{
			AudienceClient:     audienceClient,
			CampaignsStore:     pg.CampaignsStore(),
			NotificationClient: notificationClient,
		}

		worker = func(n int) {
			log := log.WithFields(rlog.Fields{"worker.id": n})

			for {
				select {
				case <-ctx.Done():
					log.Infof("stopping")
					return
				case task := <-taskc:
					var (
						start  = time.Now()
						result *campaignjobs.Result
						err    error
					)

					log = log.WithFields(rlog.Fields{
						"task.id":    task.ID,
						"task.state": task.State,
					})

					log.Infof("starting")

					// function call is required for defers to fire after
					func() {
						// release task PG's lock eventually
						defer task.Done()

						// Recover any panics and log/update task.Error
						defer que.Recover(func(val interface{}, trace string) {
							jobsPanics.Inc()
							log.WithFields(rlog.Fields{"panic": trace}).Error(val)
							if errClient != nil {
								errClient.Reportf(ctx, nil, "job_id=%d error=%q panic=%q", task.ID, trace, val)
							}
						})

						defer func() {
							log = log.WithFields(rlog.Fields{
								"dur": time.Since(start),
							})
							jobsStats.Observe(time.Since(start).Seconds())

							if err != nil {
								jobsErrors.Inc()
								log.Errorf(err.Error())
							} else {
								log.Infof("ok")
							}

							log.WithFields(rlog.Fields{
								"task":   task,
								"result": result,
							}).Debug("")
						}()

						// work
						result, err = snw.Do(ctx, task)
					}()
				}
			}
		}

		poller = func() {
			var count int
			for {
				select {
				case <-ctx.Done():
					log.Infof("poller: stopping")
					return
				default:
				}

				task, err := sn.LockOne(pgpool)
				if err != nil {
					log.Error(errors.Wrap(err, "poller: LockOne"))
					time.Sleep(*queSleepDuration)
					continue
				}
				if task == nil {
					log.Infof("poller: status=idling for=%v dispatched=%d\n", queSleepDuration, count)
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
		log.Fatalf("PrepareStatements: %v", err)
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

	log.Infof("workerpool=started")
	log.Infof("poller=started")

	//
	// HTTP endpoints
	//
	go func() {
		// measure latency distributions of your RPCs
		// grpc_prometheus.EnableHandlingTimeHistogram()

		log := log.WithFields(rlog.Fields{"probe": ""})

		http.Handle("/metrics", prom.Handler())
		http.Handle("/readiness", rhttp.ProbeChain(ctx, log, readinessProbes...))
		http.Handle("/liveness", rhttp.ProbeChain(ctx, log, livenessProbes...))
		// http.Handle("/togglelogs", loghttp.ToggleLogs(ioutil.Discard, os.Stdout, verboseLog))

		log.Infof("http=server status=listening address=%q", *httpAddr)

		if err := (&http.Server{
			Addr: *httpAddr,
			// ErrorLog: stderr,
			Handler: http.DefaultServeMux,
		}).ListenAndServe(); err != nil {
			log.Fatalf("http=server status=error error=%q", err)
		}
	}()

	//
	// Signals
	//
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	log.Infof("status=waiting_for_signal")
	select {
	case <-ctx.Done():
	case sig := <-sigc:
		log.Errorf("status=signal signal=%v\n", sig)
		cancelFn()
	}

	log.Infof("status=waiting_workers")
	wg.Wait()
	log.Infof("status=stopped")
}

func Logger(log rlog.Logger) grpc.UnaryClientInterceptor {
	return func(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
		var (
			start = time.Now()
			err   error
		)

		defer func() {
			log := log.WithFields(rlog.Fields{
				"rpc": method,
				"dur": time.Since(start),
				"req": req,
			})

			if val := recover(); val != nil {
				trace := make([]byte, 1024)
				trace = trace[:runtime.Stack(trace, false)]

				log.WithFields(rlog.Fields{"panic": string(trace)}).Error(val)

				panic(val)
			}

			if err != nil {
				log.Errorf(err.Error())
			} else {
				log.Infof("ok")
			}
		}()

		err = invoker(ctx, method, req, reply, cc, opts...)

		return err
	}
}
