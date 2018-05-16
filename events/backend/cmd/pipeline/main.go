package main

import (
	"context"
	"net/http"
	"io/ioutil"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/namsral/flag"
	"google.golang.org/grpc"

	prom "github.com/prometheus/client_golang/prometheus"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/events/backend/middleware"
	"github.com/roverplatform/rover/events/backend/pipeline"
	"github.com/roverplatform/rover/events/backend/transformers"
	"github.com/roverplatform/rover/go/logger"
)

var (
	httpAddr = flag.String("http-addr", ":5080", "http listen address")

	//
	// DSN
	//
	kafkaDSN = flag.String("kafka-dsn", "kafka:9092", "Kafka bootstrap servers dsn")

	//
	//
	// TODO figure out a naming convention so its easy convert protobuf models
	inputTopic  = flag.String("input-topic", "events.input", "Kafka input topic to read events from")
	outputTopic = flag.String("output-topic", "events.output", "kafka output topic to write transformed events")

	//
	// Service URLs
	//
	audienceServiceDsn = flag.String("audience-service-dsn", "audience:5100", "Audience Service DSN")
	geocoderServiceDsn = flag.String("geocoder-service-dsn", "geocoder:5100", "Geocoder Service DSN")
)

var (
	logLevel = flag.String("log-level", "info", "log level")
	//
	// Device
	//
	deviceModelNameJSONMapPath = flag.String("device-model-name-map-path", "", "device model name to marketing name json map file path")
)

func main() {
	flag.Parse()
	var log = logger.New()
	log.SetLevel(logger.LevelFromString(*logLevel))

	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers":  *kafkaDSN,
		"compression.codec":  "snappy",
		"group.id":           "events:pipeline:consumer", // Must be stable cannot edit
		"session.timeout.ms": 6000,
		"auto.offset.reset":  "earliest",
		"auto.commit.enable": false,
	})
	if err != nil {
		log.Fatal(err)
	}

	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers":     *kafkaDSN,
		"compression.codec":     "snappy",
		"group.id":              "events:pipeline:producer", // Must be stable cannot edit
		"session.timeout.ms":    6000,
		"request.required.acks": -1,
		"auto.offset.reset":     "earliest",
		"enable.auto.commit":    false,
	})
	if err != nil {
		log.Fatal(err)
	}
	log.Info("Connected to kafka")

	//
	// Prometheus
	//

	prom.MustRegister(pipeline.PrometheusMetrics...)

	var pipelineOpts = []pipeline.Option{
		pipeline.WithLogger(log),
	}

	/*
		Reverse Geocoding
	*/
	geocoderConn, err := grpc.Dial(*geocoderServiceDsn, grpc.WithInsecure())
	if err != nil {
		log.Fatal(err)
	}

	geocoderClient := geocoder.NewGeocoderClient(geocoderConn)

	/*
		Device & Profiles
	*/
	conn, err := grpc.Dial(
		*audienceServiceDsn,
		grpc.WithInsecure(),
		grpc.WithUnaryInterceptor(middleware.NewAudienceClientMiddleware(middleware.NewCache(5000), 30*time.Second)),
	)
	if err != nil {
		log.Fatal(err)
	}

	audienceClient := audience.NewAudienceClient(conn)

	data, err := ioutil.ReadFile(*deviceModelNameJSONMapPath)
	if err != nil {
		log.Fatal(err)
	}

	deviceModelNameMapper, err := transformers.ParseDeviceMap(string(data))
	if err != nil {
		log.Fatal(err)
	}

	handler := transformers.Root(audienceClient, geocoderClient, deviceModelNameMapper)

	p := pipeline.NewPipeline(consumer, *inputTopic, producer, *outputTopic, handler, pipelineOpts...)

	ctx, cancelFunc := context.WithCancel(context.Background())
	defer cancelFunc()

	var done = make(chan error)
	go func() {
		done <- p.Run(ctx)
	}()

	go func() {
		http.Handle("/metrics", prom.Handler())
		if err := http.ListenAndServe(*httpAddr, nil); err != nil {
			log.Fatal(err)
		}
	}()

	log.Infof("[*] Pipeline running! To exit press CTRL+C")
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	select {
	case sig := <-sigc:
		log.Debug("signal:", sig)
	case err := <-done:
		if err != nil {
			log.Info("Done:", err)
		}
	}

	p.Shutdown(30 * time.Second)
}
