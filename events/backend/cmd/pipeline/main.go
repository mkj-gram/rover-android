package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/namsral/flag"
	"google.golang.org/grpc"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/events/backend/middleware"

	"github.com/roverplatform/rover/events/backend/pipeline"
	"github.com/roverplatform/rover/events/backend/transformers"
)

var (
	kafkaDSN = flag.String("kafka-dsn", "kafka:9092", "Kafka bootstrap servers dsn")
	// TODO figure out a naming convention so its easy convert protobuf models
	inputTopic  = flag.String("input-topic", "events.input", "Kafka input topic to read events from")
	outputTopic = flag.String("output-topic", "events.output", "kafka output topic to write transformed events")

	audienceServiceDsn = flag.String("audience-service-dsn", "localhost:5100", "Audience Service DSN")
	geocoderServiceDsn = flag.String("geocoder-service-dsn", "localhost:5100", "Geocoder Service DSN")
)

func main() {
	flag.Parse()

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

	log.Println("Connected to kafka")

	// TODO register prom and http endpoint

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

	handler := transformers.Root(audienceClient, geocoderClient)

	p := pipeline.NewPipeline(consumer, *inputTopic, producer, *outputTopic, handler)

	ctx, cancelFunc := context.WithCancel(context.Background())
	defer cancelFunc()

	var done = make(chan error)
	go func() {
		done <- p.Run(ctx)
	}()

	log.Println("[*] Pipeline running! To exit press CTRL+C")
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	select {
	case sig := <-sigc:
		log.Println("signal:", sig)
	case err := <-done:
		if err != nil {
			log.Println("Done:", err)
		}
	}

	p.Shutdown(10 * time.Second)
}
