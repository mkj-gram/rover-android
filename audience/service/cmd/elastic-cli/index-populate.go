package main

import (
	"flag"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"

	"golang.org/x/net/context"

	selastic "github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"gopkg.in/mgo.v2/bson"
	elastic "gopkg.in/olivere/elastic.v5"
)

type cmdIndexPopulate struct {
	esDSN    string
	mongoDSN string
	nWorkers int

	idrange idRange
}

func (cmd *cmdIndexPopulate) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("index:populate", flag.ExitOnError)
	espFlags.StringVar(&cmd.esDSN, "elastic-dsn", "", "comma-separated list of ES URLs (e.g. 'http://192.168.2.10:9200,http://192.168.2.11:9200')")
	espFlags.StringVar(&cmd.mongoDSN, "mongo-dsn", "", "mongo DB Data Source Name")
	espFlags.IntVar(&cmd.nWorkers, "n-workers", 10, "number of workers")

	espFlags.Var(&cmd.idrange, "account-ids", "account ids to create indexes for")
	return espFlags
}

func (cmd *cmdIndexPopulate) Run(ctx context.Context) error {
	var (
		eslog   = log.New(ioutil.Discard, "elastic: ", 0)
		esdebug = log.New(ioutil.Discard, "elastic: ", 0)
	)

	if cmd.idrange.Blank() {
		stderr.Fatalln("invalid range:", cmd.idrange)
	}

	if cmd.esDSN == "" || cmd.mongoDSN == "" {
		cmd.FlagSet().PrintDefaults()
		return nil
	}

	if *verbose == "trace" {
		eslog.SetOutput(os.Stdout)
	} else if *verbose == "debug" {
		eslog.SetOutput(os.Stdout)
		esdebug.SetOutput(os.Stdout)
	}

	stdout.Println("working: account ids:", cmd.idrange.String())

	esClient, err := elastic.NewClient(
		elastic.SetURL(strings.Split(cmd.esDSN, ",")...),
		elastic.SetErrorLog(stderr),
		elastic.SetInfoLog(eslog),
		elastic.SetTraceLog(esdebug),
		elastic.SetMaxRetries(0),
		// disable sniffing so client doesn't try to establish connections
		// to the node advertized addresses(which are not directly accessible sometimes)
		elastic.SetSniff(false),
		// es.SetSnifferInterval(t.snifferInterval),
		// es.SetHealthcheck(t.healthcheck),
		// es.SetHealthcheckInterval(t.healthcheckInterval))
	)
	if err != nil {
		stderr.Fatalln("elastic:", err)
	}

	var (
		sess, info = dialMongo(cmd.mongoDSN)
		db         = sess.DB(info.Database)

		workc = make(chan func())
		wg    sync.WaitGroup
	)

	var (
	// accountAttrs  = getProfileSchemas(db)
	// deviceMapping = selastic.DeviceMapping()
	)

	reindex := func(acctId int) {
		acctIndex := selastic.AccountIndex(strconv.Itoa(acctId))

		stdout.Printf("reindex[%s]: status=starting\n", acctIndex)

		if false {
			// TODO: update mapping?
		}

		var (
			batchSize = 1000

			profile *mongodb.Profile
			device  *mongodb.Device
			bulk    = esClient.Bulk().Index(acctIndex)

			i int
		)

		// profiles
		iter := db.C("profiles").
			Find(bson.M{"account_id": acctId}).
			Batch(batchSize).
			Iter()

		for iter.Next(&profile) {
			i++

			bulk.Add(elastic.NewBulkIndexRequest().
				Id(profile.Id.Hex()).
				Doc(selastic.ProfileDoc(profile)).
				Type("profile").
				Index(acctIndex))

			if i%batchSize == 0 {
				if resp, err := bulk.Do(ctx); err != nil {
					stderr.Println("bulk.Do:", err)
				} else {
					for _, item := range resp.Failed() {
						stderr.Printf("bulk.Failed: %+v\n", item)
					}
				}
				// reset batch
				bulk = esClient.Bulk().Index(acctIndex)
			}
		}

		if bulk.NumberOfActions() > 0 {
			if resp, err := bulk.Do(ctx); err != nil {
				stderr.Println("bulk.Do:", err)
			} else {
				for _, item := range resp.Failed() {
					stderr.Printf("bulk.Failed: %+v\n", item)
				}
			}
		}

		if err := iter.Close(); err != nil {
			stderr.Println("iter.Close:", err)
		}

		stdout.Printf("reindex[%s]: status=done profiles.indexed=%d", acctIndex, i)

		i = 0

		// devices
		iter = db.C("devices").
			Find(bson.M{"account_id": acctId}).
			Batch(batchSize).
			Iter()

		for iter.Next(&device) {
			i++

			bulk.Add(elastic.NewBulkIndexRequest().
				Id(device.DeviceId).
				Doc(selastic.DeviceDoc(device)).
				Parent(device.ProfileId.Hex()).
				Type("device").
				Index(acctIndex))

			if i%batchSize == 0 {
				if resp, err := bulk.Do(ctx); err != nil {
					stderr.Println("bulk.Do:", err)
				} else {
					for _, item := range resp.Failed() {
						stderr.Printf("bulk.Failed: %+v\n", item)
					}
				}
				// reset batch
				bulk = esClient.Bulk().Index(acctIndex)
			}
		}

		if bulk.NumberOfActions() > 0 {
			if resp, err := bulk.Do(ctx); err != nil {
				stderr.Println("bulk.Do:", err)
				for _, item := range resp.Failed() {
					stderr.Printf("bulk.Failed: %+v\n", item)
				}
			}
		}

		if err := iter.Close(); err != nil {
			stderr.Println("iter.Close:", err)
		}

		stdout.Printf("reindex[%s]: status=done devices.indexed=%d", acctIndex, i)
	}

	for i := 0; i < cmd.nWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				case work, ok := <-workc:
					if !ok {
						return
					}
					work()
				}
			}
		}()
	}

	for i := cmd.idrange.From; i <= cmd.idrange.To; i++ {
		// NOTE: required
		// ensures acctId is passed by value not by pointer to i
		var acctId = i
		workc <- func() {
			reindex(acctId)
		}
	}

	close(workc)

	wg.Wait()
	stdout.Println("Done!")

	return nil
}
