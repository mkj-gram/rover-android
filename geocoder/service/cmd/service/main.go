package main

import (
	"log"
	"net"
	"os"
	"os/signal"
	"time"

	"github.com/go-redis/redis"
	"github.com/namsral/flag"
	"github.com/newrelic/go-agent"
	"google.golang.org/grpc"
	"googlemaps.github.io/maps"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service"
	"github.com/roverplatform/rover/geocoder/service/cache"
	"github.com/roverplatform/rover/go/grpc/middleware"
	"github.com/roverplatform/rover/go/grpc/middleware/newrelic"
)

const (
	newRelicAppName = "Geocoder Service"
)

var (
	rpcAddr = flag.String("rpc-addr", ":5100", "rpc address")

	gcpApiKey = flag.String("gcp-api-key", "", "google api key")

	redisDsn = flag.String("redis-dsn", "", "redis dsn")

	newRelicKey = flag.String("newrelic-key", "", "Newrelic license key")
)

func main() {
	flag.EnvironmentPrefix = "GEOCODER_SERVICE"
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	/*
		Service handler setup
	*/
	client, err := maps.NewClient(maps.WithAPIKey(*gcpApiKey))
	if err != nil {
		log.Fatalf("maps.NewClient: %v\n", err)
	}

	redisOpts, err := redis.ParseURL(*redisDsn)
	if err != nil {
		log.Fatalf("redis.ParseURL: %v\n", err)
	}
	redisClient := redis.NewClient(redisOpts)
	cacheStore := &cache.Store{Client: redisClient}

	server := service.Server{Client: client, Cache: cacheStore}

	/*
		GRPC setup
	*/
	var (
		grpcOpts            []grpc.ServerOption
		grpcUnaryMiddleware []grpc.UnaryServerInterceptor
	)

	if *newRelicKey != "" {
		config := newrelic.NewConfig(newRelicAppName, *newRelicKey)
		app, err := newrelic.NewApplication(config)
		if err != nil {
			log.Fatalf("Failed to initialize New Relic: %v", err)
		}

		defer app.Shutdown(time.Second * 10)

		grpcUnaryMiddleware = append(grpcUnaryMiddleware, grpc_newrelic.UnaryServerInterceptor(app))

		log.Println("newrelic=on")
	} else {
		log.Println("newrelic=off")
	}

	lis, err := net.Listen("tcp", *rpcAddr)
	if err != nil {
		log.Fatalf("net.Listen: %v", err)
	}

	if len(grpcUnaryMiddleware) > 0 {
		grpcOpts = append(grpcOpts, grpc.UnaryInterceptor(middleware.UnaryChain(grpcUnaryMiddleware...)))
	}

	grpcServer := grpc.NewServer(grpcOpts...)
	geocoder.RegisterGeocoderServer(grpcServer, &server)

	go func() {
		log.Println("grpc server started")
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("grpc.Serve: %v\n", err)
		}
	}()

	/*
		Signals
	*/
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt)

	select {
	case sig := <-sigc:
		log.Println("signal:", sig)
	}

	grpcServer.GracefulStop()
	log.Println("stopped")
}
