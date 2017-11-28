package main

import (
	"log"
	"net"
	"os"
	"os/signal"

	"github.com/go-redis/redis"
	"github.com/namsral/flag"
	"google.golang.org/grpc"
	"googlemaps.github.io/maps"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service"
	"github.com/roverplatform/rover/geocoder/service/cache"
)

var (
	rpcAddr = flag.String("rpc-addr", ":5100", "rpc address")

	gcpApiKey = flag.String("gcp-api-key", "", "google api key")

	redisDsn = flag.String("redis-dsn", "", "redis dsn")
)

func main() {
	flag.EnvironmentPrefix = "GEOCODER_SERVICE"
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	lis, err := net.Listen("tcp", *rpcAddr)
	if err != nil {
		log.Fatalf("net.Listen: %v", err)
	}

	var grpcOpts []grpc.ServerOption
	grpcServer := grpc.NewServer(grpcOpts...)

	client, err := maps.NewClient(maps.WithAPIKey(*gcpApiKey))
	if err != nil {
		log.Fatal(err)
	}

	// Setup redis
	redisOpts, err := redis.ParseURL(*redisDsn)
	if err != nil {
		log.Fatal(err)
	}
	redisClient := redis.NewClient(redisOpts)
	cacheStore := &cache.Store{Client: redisClient}

	server := service.Server{Client: client, Cache: cacheStore}
	geocoder.RegisterGeocoderServer(grpcServer, &server)

	go func() {
		log.Println("grpc server started")
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("grpc.Serve: %v\n", err)
		}
	}()

	//
	// Signals
	//
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt)

	select {
	case sig := <-sigc:
		log.Println("signal:", sig)
	}

	grpcServer.GracefulStop()
	log.Println("stopped")
}
