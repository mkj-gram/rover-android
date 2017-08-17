package main

import (
	"context"
	"flag"
	"log"
	"sync"
	"time"

	mgo "gopkg.in/mgo.v2"

	"google.golang.org/grpc"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

// Example
// ./bench -rpc-addr=10.47.251.194:5100 -nconn 50 --acct-id 38 --profile-id 57d21747d4f912002d716322

var (
	rpcAddr = flag.String("rpc-addr", "", "service rpc addr")
	N       = flag.Int("nconn", 50, "number of concurrent clients")
	logErrs = flag.Bool("log-errors", false, "log errros")

	accountId = flag.Int("acct-id", 3, "account id")
	profileId = flag.String("profile-id", "5991f86308104900011bf8ea", "profile id")
)

func main() {

	flag.Parse()

	log.SetFlags(log.Lshortfile)

	var (
		ctx = context.Background()
	)

	req := &audience.ListDevicesByProfileIdRequest{
		AuthContext: &auth.AuthContext{AccountId: 3},
		ProfileId:   *profileId,
	}

	log.Printf("Starting")

	type Stats struct {
		Nerrors  int
		Nsuccess int
		N        int
		Rerrors  int
		Rsuccess int
		R        int
		Err      error

		TDur time.Duration
		RDur time.Duration
	}

	var (
		wg    sync.WaitGroup
		stats struct {
			sync.RWMutex
			Stats
		}
	)

	for i := 0; i < *N; i++ {
		wg.Add(1)
		go func() {
			conn, err := grpc.Dial(*rpcAddr, grpc.WithInsecure())
			if err != nil {
				log.Fatal("grpc.dial:", err)
			}
			defer conn.Close()

			client := audience.NewAudienceClient(conn)

			for {
				start := time.Now()
				_, err := client.ListDevicesByProfileId(ctx, req)
				dur := time.Now().Sub(start)
				stats.Lock()
				stats.N++
				stats.TDur += dur
				stats.Err = err
				if err != nil {
					stats.Nerrors++
					if *logErrs {
						log.Println("client:", err)
					}
				} else {
					stats.Nsuccess++
				}
				stats.Unlock()
			}
			wg.Done()
		}()

	}
	go func() {
		var prev, curr Stats
		for {
			time.Sleep(1 * time.Second)
			stats.RLock()
			curr = stats.Stats
			stats.RUnlock()

			curr.R = curr.N - prev.N
			curr.Rerrors = curr.Nerrors - prev.Nerrors
			curr.Rsuccess = curr.Nsuccess - prev.Nsuccess
			if curr.R > 0 {
				curr.RDur = time.Duration((curr.TDur - prev.TDur) / time.Duration(curr.R))
			}

			log.Printf("Stats:%+v\n", curr)
			prev = curr
		}
	}()

	log.Printf("Working")
	wg.Wait()
	log.Printf("Done")
}

func dialMongo(dsn string) (*mgo.Session, *mgo.DialInfo) {
	dialInfo, err := mongodb.ParseURL(dsn)
	if err != nil {
		log.Fatalln("mongodb:", err)
	}

	sess, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		log.Fatalf("mgo.Dial: DSN=%q error=%q", dsn, err)
	}

	return sess, dialInfo
}
