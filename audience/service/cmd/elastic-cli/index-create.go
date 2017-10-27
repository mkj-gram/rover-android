package main

import (
	"flag"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"

	selastic "github.com/roverplatform/rover/audience/service/elastic"
	"golang.org/x/net/context"
	elastic "gopkg.in/olivere/elastic.v5"
)

type cmdIndexCreate struct {
	esDSN    string
	mongoDSN string

	idrange idRange
}

func (cmd *cmdIndexCreate) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("index:create", flag.ExitOnError)
	espFlags.StringVar(&cmd.esDSN, "elastic-dsn", "", "comma-separated list of ES URLs (e.g. 'http://192.168.2.10:9200,http://192.168.2.11:9200')")
	espFlags.StringVar(&cmd.mongoDSN, "mongo-dsn", "", "mongo DB Data Source Name")

	espFlags.Var(&cmd.idrange, "account-ids", "account ids to create indexes for")
	return espFlags
}

func (cmd *cmdIndexCreate) Run(ctx context.Context) error {
	var (
		eslog   = log.New(ioutil.Discard, "elastic: ", 0)
		esdebug = log.New(ioutil.Discard, "elastic: ", 0)
	)

	if cmd.idrange.Blank() {
		stderr.Fatalln("invalid range:", cmd.idrange)
	}

	stdout.Println("creating indexes for account ids:", cmd.idrange.String())

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

	esClient, err := elastic.NewClient(
		elastic.SetURL(strings.Split(cmd.esDSN, ",")...),
		elastic.SetErrorLog(stderr),
		elastic.SetInfoLog(stdout),
		elastic.SetTraceLog(eslog),
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

		idrange = cmd.idrange

		// all accounts schemas for profile and device
		profileCustomSchemas = getProfileCustomSchemas(db)
		deviceCustomSchemas  = getDeviceCustomSchemas(db)
	)

	for i := idrange.From; i <= idrange.To; i++ {
		indexName := selastic.AccountIndex(strconv.Itoa(i))
		_, err := esClient.CreateIndex(indexName).Do(ctx)
		if err != nil {
			switch e := err.(type) {
			case *elastic.Error:
				// If the index already exists we can just skip over it
				if e.Details.Type == "index_already_exists_exception" {
					stdout.Printf("Index already exists: %s", indexName)
				} else {
					stderr.Fatalf("account[%d]: %v", i, err)
				}
			default:
				stderr.Fatalf("account[%d]: %v", i, err)
			}
		}

		var (
			profileCustomAttrsMapping = selastic.CustomAttributesMapping(profileCustomSchemas[i])
			profileMapping            = selastic.ProfileMapping(profileCustomAttrsMapping)

			deviceCustomAttrsMapping = selastic.CustomAttributesMapping(deviceCustomSchemas[i])
			deviceMapping            = selastic.DeviceMapping(deviceCustomAttrsMapping)
		)

		_, err = esClient.PutMapping().Index(indexName).
			Type("device").
			BodyJson(deviceMapping).
			Do(ctx)
		if err != nil {
			stderr.Fatalf("deviceMapping[%d]: %v", i, err)
		}

		_, err = esClient.PutMapping().Index(indexName).
			Type("profile").
			BodyJson(profileMapping).
			Do(ctx)
		if err != nil {
			stderr.Fatalf("profileMapping[%d]: %v", i, err)
		}

	}

	return nil
}
