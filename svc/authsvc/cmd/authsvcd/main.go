package main

import (
	"flag"
	"fmt"
	"net"

	"github.com/roverplatform/rover/svc/authsvc"
	"github.com/roverplatform/rover/svc/authsvc/db/postgres"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/grpclog"
)

var (
	tls      = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP")
	certFile = flag.String("cert-file", "cert.pem", "The TLS cert file")
	keyFile  = flag.String("key-file", "server.key", "The TLS key file")
	port     = flag.Int("port", 40000, "The server port")
	dbDSN    = flag.String("db-dsn", "", "database Data Source Name")
)

func main() {
	flag.Parse()

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		grpclog.Fatalf("failed to listen: %v", err)
	}

	var opts []grpc.ServerOption

	if *tls {
		creds, err := credentials.NewServerTLSFromFile(*certFile, *keyFile)
		if err != nil {
			grpclog.Fatalf("Failed to generate credentials %v", err)
		}
		opts = append(opts, grpc.Creds(creds))
	}

	srv := grpc.NewServer(opts...)

	db, err := postgres.Open(*dbDSN)
	if err != nil {
		grpclog.Fatalln("main:db:open:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		grpclog.Fatalln("db:ping:", err)
	}

	authsvc.Register(srv, &authsvc.Server{DB: db})

	if err := srv.Serve(lis); err != nil {
		grpclog.Println("server.Serve:", err)
	}
}
