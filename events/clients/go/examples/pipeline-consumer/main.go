package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"os/signal"
	"syscall"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"
	"github.com/roverplatform/rover/apis/go/event/v1"
	"github.com/roverplatform/rover/events/clients/go/pipeline"
)

var topic = "pipeline.example"

func produce(num int) {
	p, _ := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers":  "kafka:9092",
		"compression.codec":  "snappy",
		"group.id":           "events:something:pipeline", // Must be stable cannot edit
		"session.timeout.ms": 6000,
		"auto.offset.reset":  "earliest",
		"auto.commit.enable": false,
	})

	log.Printf("Producing %d messages\n", num)

	for i := 0; i < num; i++ {

		ev := event.Event{
			Input: &event.EventInput{
				Id: fmt.Sprint(i),
			},
		}

		if rand.Int31n(2) == 0 {
			ev.Input.Name = fmt.Sprintf("Name: %d", i)
		}

		out, _ := proto.Marshal(&ev)
		msg := kafka.Message{Value: out, TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: int32(i) % 3}}
		err := p.Produce(&msg, nil)
		if err != nil {
			log.Fatal(err)
		}
	}
}

type Receiver struct {
}

func (*Receiver) Handle(input *event.Event) bool {
	fmt.Println(input)
	return true
}

func main() {

	produce(10)

	ctx, cancel := context.WithCancel(context.Background())

	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers":  "kafka:9092",
		"compression.codec":  "snappy",
		"group.id":           "events:something:pipeline", // Must be stable cannot edit
		"session.timeout.ms": 6000,
		"auto.offset.reset":  "earliest",
		"enable.auto.commit": true,
	})
	if err != nil {
		log.Fatal(err)
	}
	c.Subscribe(topic, nil)

	var streamFinished = make(chan error)

	stream := pipeline.NewStreamConsumer(c)

	go func() {
		streamFinished <- stream.Receive(ctx, &Receiver{})
	}()

	log.Println("[*] Consumer running! To exit press CTRL+C")
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-streamFinished:
		if err != nil {
			log.Fatal(err)
		}
		return
	case sig := <-sigc:
		log.Println("signal:", sig)
		cancel()
	}

	// wait for consumer to return
	if err := <-streamFinished; err != nil {
		log.Fatalln("Consumer exited with error: ", err)
	}

	log.Println("Consumer exited sucessfully")

}
