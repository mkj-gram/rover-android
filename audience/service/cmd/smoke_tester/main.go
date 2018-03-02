// generates audience service load by calling RPCs
package main

import (
	"context"
	"flag"
	"log"
	"net/url"
	"os"
	"strings"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"

	"google.golang.org/grpc"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var (
	DSN     = flag.String("dsn", "", "mongo DSN")
	rpcAddr = flag.String("rpc-addr", "localhost:5100", "service rpc address")

	stdout = log.New(os.Stdout, "", log.Ltime)
	stderr = log.New(os.Stderr, "Err: ", log.Ltime|log.Lshortfile)
)

func main() {

	flag.Parse()

	sess, err := mgo.Dial(*DSN)
	if err != nil {
		stderr.Fatalln("src:", err)
	}

	conn, err := grpc.Dial(*rpcAddr, grpc.WithInsecure())
	if err != nil {
		stderr.Fatalln("grpc.Dial:", err)
	}
	client := audience.NewAudienceClient(conn)

	var (
		db = sess.DB(dbName(*DSN))

		devicesColl = db.C("devices")
		// profilesColl        = db.C("profiles")
		// profilesSchemasColl = db.C("profiles_schemas")

		ctx = context.Background()
	)

	for iter := devicesColl.Find(bson.M{}).Iter(); !iter.Done(); {
		var data map[string]interface{}
		if !iter.Next(&data) {
			if err := iter.Err(); err != nil {
				stderr.Fatalln("iter.Next:", err)
				break
			}
		}

		var (
			device_id, _ = data["device_id"].(string)
			account_id   = data["account_id"].(int)
		)

		stdout.Printf("DeviceID: %v, AccountId: %v\n", device_id, account_id)

		p, err := client.GetProfileByDeviceId(ctx, &audience.GetProfileByDeviceIdRequest{
			AuthContext: &auth.AuthContext{AccountId: int32(account_id)},
			DeviceId:    device_id,
		})

		if err != nil {
			stderr.Fatalln("grpc.GetProfileByDeviceId:", err)
		} else {
			stdout.Printf("Profile: %v\n", p)
		}

		ps, err := client.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{
			AuthContext: &auth.AuthContext{AccountId: int32(account_id)},
		})

		if err != nil {
			stderr.Fatalln("GetProfileSchema:", err)
		} else {
			stdout.Printf("ProfileSchema: %v\n", ps)
		}

		d, err := client.GetDevice(ctx, &audience.GetDeviceRequest{
			AuthContext: &auth.AuthContext{AccountId: int32(account_id)},
			DeviceId:    device_id,
		})

		if err != nil {
			stderr.Fatalln("GetDevice:", err)
		} else {
			stdout.Printf("GetDevice: %v\n", d)
		}
	}

	stdout.Println("Done!")
}

func dbName(dsn string) string {
	u, err := url.Parse(dsn)
	if err != nil {
		stderr.Panicln("url.Parse:", err)
	}

	return strings.TrimLeft(u.Path, "/")
}
