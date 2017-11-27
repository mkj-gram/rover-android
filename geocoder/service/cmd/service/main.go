package main

import (
	"log"
	"net"
	"os"
	"os/signal"

	"github.com/namsral/flag"
	"google.golang.org/grpc"
	"googlemaps.github.io/maps"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/geocoder/service"
)

var (
	rpcAddr = flag.String("rpc-addr", ":5100", "rpc address")

	gcpApiKey = flag.String("gcp-api-key", "", "google api key")
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

	server := service.Server{Client: client}
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
