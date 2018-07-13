package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"google.golang.org/grpc"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/kafka"
	"github.com/roverplatform/rover/audience/service/notification"
	probes "github.com/roverplatform/rover/go/http"
	"github.com/roverplatform/rover/go/logger"
	"github.com/roverplatform/rover/go/registry/topics"
)

var (
	logLevel = flag.String("log-level", "debug", "log level")

	//
	// Audience
	//
	audienceURL = flag.String("audience-url", "audience:5100", "audience service URL")

	//
	// Http
	//
	httpAddr = flag.String("http-addr", ":5080", "http listen address")

	//
	// Kafka
	//
	kafkaDSN = flag.String("kafka-dsn", "", "kafka connection string")
)

const ConsumerGroupName = "audience:consumer"

func main() {
	flag.Parse()

	if *kafkaDSN == "" {
		flag.PrintDefaults()
		os.Exit(2)
	}

	var (
		ctx, cancel = context.WithCancel(context.Background())

		readinessProbes []probes.ProbeFunc
		livenessProbes  []probes.ProbeFunc
	)

	defer cancel()

	//
	// Logging
	//
	var log = logger.New()
	log.SetLevel(logger.LevelFromString(*logLevel))

	//
	// Audience Client
	//

	var conn, err = grpc.DialContext(ctx, *audienceURL, grpc.WithInsecure())
	if err != nil {
		log.Fatal(errors.Wrap(err, "audience.Dial"))
	}

	var audienceClient = audience.NewAudienceClient(conn)

	//
	// Kafka
	//

	var (
		notificationEventsHandler = &notification.EventsHandler{
			AudienceClient: audienceClient,
		}

		handlers = map[string]kafka.Handler{
			topics.NotificationEvents: kafka.HandlerFunc(func(ctx context.Context, msg *kafka.Message) {
				_, err := notificationEventsHandler.Handle(ctx, msg)
				if err != nil {
					log.Error(err.Error())
				}
			}),
		}
	)

	config, err := kafka.ParseDSN(*kafkaDSN, kafka.DefaultConfig())
	config["group.id"] = ConsumerGroupName
	ksrv, err := kafka.NewServer(&config, handlers)
	if err != nil {
		log.Fatalf("%v", errors.Wrap(err, "kafka.NewServer"))
	}

	go func() {
		if err := ksrv.Run(); err != nil {
			log.Fatal(errors.Wrap(err, "kafka.(*Server).Run"))
		}
	}()

	go func() {
		log.Infof("http listening on %s", *httpAddr)
		probeLog := log.WithFields(logger.Fields{"probe": ""})
		http.Handle("/readiness", probes.ProbeChain(ctx, probeLog, readinessProbes...))
		http.Handle("/liveness", probes.ProbeChain(ctx, probeLog, livenessProbes...))
		http.Handle("/metrics", prometheus.Handler())
		if err := http.ListenAndServe(*httpAddr, nil); err != nil {
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

	log.Info("stopping")
	if err := ksrv.Stop(nil); err != nil {
		log.Error(err.Error())
	}

	log.Info("finished")
}
