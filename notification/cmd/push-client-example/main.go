package main

import (
	"crypto/tls"
	"flag"
	"fmt"
	"io/ioutil"
	"log"

	"golang.org/x/crypto/pkcs12"

	"github.com/appleboy/go-fcm"
	"github.com/sideshow/apns2"
)

var (
	push struct {
		Provider string
		Env      string

		CertData string
		CertPass string

		PushToken string
	}
)

// go run ./notification/cmd/push-client-example/main.go --env production --provider apns --cert-data=$HOME/io.rover.inbox.p12 --cert-pass=************************ --push-token=*****************************************************************

func main() {

	flag.StringVar(&push.Provider, "provider", "", "apns|fcm")
	flag.StringVar(&push.Env, "env", "", "ios only: push environment")
	flag.StringVar(&push.CertData, "cert-data", "", "certificate data base64 encoded or server key for android")
	flag.StringVar(&push.CertPass, "cert-pass", "", "certificate's pass phrase")
	flag.StringVar(&push.PushToken, "push-token", "", "device push token")

	flag.Parse()

	fmt.Printf("Info: %+v\n", push)

	switch push.Provider {
	case "fcm":

		type M map[string]interface{}

		req := &fcm.Message{
			To: push.PushToken,
			// Notification: nil,
			Data: M{
				"rover": M{
					"notification": "hello",
				},
			},
		}

		client, err := fcm.NewClient(push.CertData)
		if err != nil {
			log.Fatal(err)
		}
		resp, err := client.Send(req)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("%+v\n", resp)

	case "apns":
		data, err := ioutil.ReadFile(push.CertData)
		if err != nil {
			log.Fatal(err)
		}

		pkey, cert, err := pkcs12.Decode(data, push.CertPass)
		if err != nil {
			log.Fatal(err)
		}

		tlsCert := tls.Certificate{
			Certificate: [][]byte{cert.Raw},
			PrivateKey:  pkey,
			Leaf:        cert,
		}

		notification := &apns2.Notification{}
		notification.DeviceToken = push.PushToken
		notification.Topic = "io.rover.Inbox"
		notification.Payload = []byte(`{"aps":{"alert":"Hello!"}}`)

		client := apns2.NewClient(tlsCert)

		switch push.Env {
		case "development":
			client.Development()
		case "production":
			client.Production()
		default:
			log.Fatalln("unknown env:", push.Env)
		}

		resp, err := client.Push(notification)

		fmt.Printf("%+v\n", resp)
		if err != nil {
			log.Fatal(err)
		}
	}

}
