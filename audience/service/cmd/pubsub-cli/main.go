package main

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/pubsub"
	"github.com/namsral/flag"
)

var (
	topicName    = flag.String("pubsub-topic-name", "audience-service-dev-topic", "pubsub's local topic name to push updates to")
	subscription = flag.String("pubsub-subscription", "audience-service-dev-subscription", "pubsub's local subscription to local topic name")
	gcpProjectID = flag.String("gcp-project-id", "rover-development", "GCP PROJECT_ID")
)

func main() {
	flag.CommandLine.Init("", flag.ExitOnError)
	flag.Parse()

	var (
		ctx, cancelFn = context.WithCancel(context.Background())
		topic         *pubsub.Topic
		stderr        = log.New(os.Stderr, "error: ", 0)
		stdout        = log.New(os.Stdout, "", 0)
	)

	defer cancelFn()

	pubsubClient, err := pubsub.NewClient(ctx, *gcpProjectID)
	if err != nil {
		stderr.Fatalf("pubsub.NewClient: %v", err)
	} else {
		stdout.Println("Connected to PubSub")
	}

	// Create Topic
	topic = pubsubClient.Topic(*topicName)
	ok, err := topic.Exists(ctx)
	if err != nil {
		stderr.Fatalf("Topic Exists: %v", err)
	}

	if !ok {
		_, err = pubsubClient.CreateTopic(ctx, *topicName)
		if err != nil {
			stderr.Fatalf("Create Topic: %v", err)
		}
	}

	// Create Subscription
	sub := pubsubClient.Subscription(*subscription)
	okay, err := sub.Exists(ctx)
	if err != nil {
		stderr.Fatalf("Subscription Exists: %v", err)
	}

	if !okay {
		_, err = pubsubClient.CreateSubscription(
			context.Background(),
			*subscription,
			pubsub.SubscriptionConfig{Topic: topic},
		)
		if err != nil {
			stderr.Fatalf("Create Subscription: %v", err)
		}
	}

	stdout.Println("PubSub configured successfully")
}
