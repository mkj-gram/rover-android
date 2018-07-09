package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/namsral/flag"
	"github.com/prometheus/client_golang/prometheus"

	"github.com/roverplatform/rover/analytics/backend/collector"
	"github.com/roverplatform/rover/analytics/backend/influx"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/go/http"
	"github.com/roverplatform/rover/go/logger"
)

var (
	httpAddr = flag.String("http-addr", ":5080", "http listen address")
	logLevel = flag.String("log-level", "debug", "log level")

	kafkadsn  = flag.String("kafka-dsn", "", "kafka connection string")
	influxdsn = flag.String("influxdb-dsn", "", "influx db connection string")
)

func main() {
	flag.Parse()

	if *influxdsn == "" {
		flag.PrintDefaults()
		os.Exit(2)
	}

	if *kafkadsn == "" {
		flag.PrintDefaults()
		os.Exit(2)
	}

	var (
		ctx, cancel = context.WithCancel(context.Background())

		readinessProbes []probes.ProbeFunc
		livenessProbes  []probes.ProbeFunc
	)

	//
	// Logging
	//
	var log = logger.New()
	log.SetLevel(logger.LevelFromString(*logLevel))

	//
	// Influx
	//
	client, err := influx.NewClient(*influxdsn)
	if err != nil {
		log.Fatal(err)
	}
	var influxProbe = func(ctx context.Context) error {
		return client.Ping(time.Second * 5)
	}
	readinessProbes = append(readinessProbes, influxProbe)
	livenessProbes = append(livenessProbes, influxProbe)

	//
	// Usecase(Application)
	//
	var notificationUseCase = usecase.NotificationsInteractor{
		OpenedStore: &influx.NotificationOpenedStore{Client: client},
		SentStore:   &influx.NotificationSentStore{Client: client},
	}

	//
	// Collector & Handlers
	//
	// TODO move this into the package. Main shouldn't know about topics and routing
	var handlers = map[string]collector.Handler{
		"notification.events": &collector.NotificationEventsHandler{Interactor: notificationUseCase},
		"events.output":       &collector.PipelineEventsHandler{NotificationInteractor: notificationUseCase},
	}

	server, err := collector.NewServer(*kafkadsn, handlers)
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		log.Info("collector started")
		if err := server.Run(); err != nil {
			log.Fatal(err)
		}
	}()

	var httpServer = http.Server{Addr: *httpAddr}
	go func() {
		log.Infof("http listening on %s", *httpAddr)
		http.Handle("/readiness", probes.ProbeChain(ctx, log, readinessProbes...))
		http.Handle("/liveness", probes.ProbeChain(ctx, log, livenessProbes...))
		http.Handle("/metrics", prometheus.Handler())
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()

	//
	// Signals
	//
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)
	select {
	case sig := <-sigc:
		log.WithFields(logger.Fields{"signal": fmt.Sprintf("%v", sig)}).Info("received signal")
	}

	cancel()

	log.Info("collector stopping")
	server.Stop()

	log.Info("http server stopping")
	httpServer.Shutdown(ctx)

	log.Info("finished")
}
