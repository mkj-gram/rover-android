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

	"github.com/roverplatform/rover/analytics/backend/delivery/grpc"
	"github.com/roverplatform/rover/analytics/backend/influx"
	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/go/http"
	"github.com/roverplatform/rover/go/logger"
)

var (
	rpcAddr  = flag.String("rpc-addr", ":5100", "grpc bind address")
	httpAddr = flag.String("http-addr", ":5080", "http bind address")

	influxdsn = flag.String("influxdb-dsn", "", "influx db connection string")

	logLevel = flag.String("log-level", "debug", "log level")
)

func main() {
	flag.Parse()

	if *influxdsn == "" {
		flag.PrintDefaults()
		os.Exit(2)
	}

	var (
		ctx, cancel     = context.WithCancel(context.Background())
		readinessProbes []probes.ProbeFunc
		livenessProbes  []probes.ProbeFunc
	)

	//
	// Logging
	//
	var log = logger.New()
	log.SetLevel(logger.LevelFromString(*logLevel))

	//
	// DB
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
	// HTTP
	//
	httpServer := &http.Server{Addr: *httpAddr}
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
	// GRPC
	//
	server := grpc.Server{
		NotificationUseCase: notificationUseCase,
	}
	go func() {
		log.Infof("rpc listening on %s", *rpcAddr)
		if err := server.ListenAndServe(*rpcAddr); err != nil {
			log.Fatal(err)
		}
	}()

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	//
	// Signals
	//
	select {
	case sig := <-sigc:
		log.WithFields(logger.Fields{"signal": fmt.Sprintf("%v", sig)}).Info("received signal")
	}

	cancel()

	// Shutdown
	log.Info("http shutting down")
	ctx, _ = context.WithTimeout(ctx, 10*time.Second)
	httpServer.Shutdown(ctx)

	log.Info("grpc shutting down")
	server.Shutdown()

	log.Info("finished")
}
