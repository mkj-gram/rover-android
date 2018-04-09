package main

import (
	"context"

	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	_ "github.com/lib/pq"
	"google.golang.org/grpc"

	"github.com/namsral/flag"

	notification "github.com/roverplatform/rover/apis/go/notification/v1"
	notification_grpc "github.com/roverplatform/rover/notification/grpc"
	"github.com/roverplatform/rover/notification/postgres"
)

var (
	rpcAddr     = flag.String("rpc-addr", ":5200", "rpc address")
	postgresDsn = flag.String("postgres-dsn", "postgres://postgres:@localhost/test?sslmode=disable", "postgres")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())
		_             = ctx
	)

	//
	// Postgres
	//
	db, err := postgres.Open(*postgresDsn)
	if err != nil {
		stderr.Fatalln("postgres.Open", err)
	}

	//
	// Notification Server
	//

	notificationServer := &notification_grpc.Server{
		DB: db,
	}

	//
	// GRPC
	//
	var (
		grpcServer = grpc.NewServer()
	)

	notification.RegisterNotificationServer(grpcServer, notificationServer)

	go func() {
		lis, err := net.Listen("tcp", *rpcAddr)
		if err != nil {
			stderr.Fatalln("net.Listen", err)
		}

		if err := grpcServer.Serve(lis); err != nil {
			stderr.Println("Serve", err)
		}
	}()

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	//
	// Signals
	//
	select {
	case <-sigc:
		log.Printf("Terminating")
	}

	cancelFn()

	grpcServer.GracefulStop()
}
