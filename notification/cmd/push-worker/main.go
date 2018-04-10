package main

import (
	"context"
	"time"

	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/namsral/flag"
	"google.golang.org/api/option"

	"cloud.google.com/go/pubsub"

	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
)

var (
	httpAddr = flag.String("http-addr", ":5080", "http address")

	// GCP
	gcpProjectID      = flag.String("gcp-project-id", "", "GCP PROJECT_ID")
	gcpSvcAcctKeyPath = flag.String("gcp-service-account-key-path", "", "path to google service account key file")

	// GCP PubSub
	pubsubSubcription            = flag.String("pubsub-subscription", "notification-push-worker", "GCP pubsub's subscription name")
	pubSubMaxOutstandingMessages = flag.Int("pubsub-max-outstanding-messages", 1, "number of batches allowed to be processed in parallel")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)
)

func main() {
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())

		pubsubOpts []option.ClientOption
	)

	//
	// Pubsub
	//

	if *gcpProjectID != "" {
		pubsubOpts = append(pubsubOpts, option.WithServiceAccountFile(*gcpSvcAcctKeyPath))
	}

	pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID, pubsubOpts...)
	if err != nil {
		stderr.Fatalf("pubsub.NewClient: %v", err)
	} else {
		stdout.Println("gcp.pubsub=on")
	}

	var (
		subscription = pubsubClient.Subscription(*pubsubSubcription)
	)

	subscription.ReceiveSettings = pubsub.ReceiveSettings{
		MaxExtension:           10 * time.Minute,
		MaxOutstandingMessages: 1000,
		MaxOutstandingBytes:    1e9, // 1G
		NumGoroutines:          1,
	}

	//
	// Notification Pubsub
	//

	var (
		subscriber = notification_pubsub.Subscriber{
			Subscription: subscription,
		}

		onReceive = func(ctx context.Context, m notification_pubsub.Message) error {
			switch nmsg := m.(type) {
			case *notification_pubsub.PushMessage:
				_ = nmsg
			case *notification_pubsub.SilentPush:
				_ = nmsg
			default:
				// TODO:
			}

			return nil
		}
	)
	go func() {
		for {
			if err := subscriber.Subscribe(ctx, onReceive); err != nil {
				// errClient.Reportf(ctx, nil, "pubsub.receive: error=%q", err)
				stderr.Fatalf("pubsub.receive: status=error error=%q\n", err)
			} else {
				stdout.Printf("pubsub.receive=exiting status=OK\n")
			}
		}
	}()

	// go func() {
	// 	lis, err := net.Listen("tcp", *rpcAddr)
	// 	if err != nil {
	// 		stderr.Fatalln("net.Listen", err)
	// 	}
	//
	// 	if err := grpcServer.Serve(lis); err != nil {
	// 		stderr.Println("Serve", err)
	// 	}
	// }()

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
}
