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

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service"
	"github.com/roverplatform/rover/geocoder/service/cache"
	"github.com/roverplatform/rover/geocoder/service/locationiq"
	"github.com/roverplatform/rover/geocoder/service/mappings"
	"github.com/roverplatform/rover/go/grpc/middleware"
	"github.com/roverplatform/rover/go/grpc/middleware/newrelic"
)

const (
	newRelicAppName = "Geocoder Service"
)

var (
	rpcAddr = flag.String("rpc-addr", ":5100", "rpc address")

	redisDsn = flag.String("redis-dsn", "", "redis dsn")

	newRelicKey = flag.String("newrelic-key", "", "Newrelic license key")

	locationIqAPIKey    = flag.String("locationiq-api-key", "", "locationIQ api key")
	locationIqZoomLevel = flag.Int("locationiq-zoom-level", 10, "locationIQ zoom level")

	countryMappingFile = flag.String("country-mapping", "./mappings/ISO3166Countries.json", "country mapping file")
)

func main() {
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	/*
		Service handler setup
	*/

	client, err := locationiq.NewClient(*locationIqAPIKey, *locationIqZoomLevel)
	if err != nil {
		log.Fatalf("locationIQ.NewClient: %v\n", err)
	}

	mappingHelper, err := mappings.NewCountry(*countryMappingFile)
	if err != nil {
		log.Fatalf("mappings.NewCountry: %v\n", err)
	}

	redisOpts, err := redis.ParseURL(*redisDsn)
	if err != nil {
		log.Fatalf("redis.ParseURL: %v\n", err)
	}
	redisClient := redis.NewClient(redisOpts)
	cacheStore := &cache.Store{Client: redisClient}

	server := service.Server{Client: client, Cache: cacheStore, CountryMapping: mappingHelper}

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
