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

type cmdIndexDelete struct {
	esDSN   string
	idrange idRange
}

func (cmd *cmdIndexDelete) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("index:delete", flag.ExitOnError)
	espFlags.StringVar(&cmd.esDSN, "elastic-dsn", "", "comma-separated list of ES URLs (e.g. 'http://192.168.2.10:9200,http://192.168.2.11:9200')")
	espFlags.Var(&cmd.idrange, "account-ids", "account ids to create indexes for")
	return espFlags
}

func (cmd *cmdIndexDelete) Run(ctx context.Context) error {
	var (
		eslog   = log.New(ioutil.Discard, "elastic: ", 0)
		esdebug = log.New(ioutil.Discard, "elastic: ", 0)
		idrange = cmd.idrange
	)

	if cmd.esDSN == "" {
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

	indicesDelete := elastic.NewIndicesDeleteService(esClient)

	if idrange.String() == "0" {
		stdout.Println("Delete all index")
		indicesDelete.Index([]string{"*"})
		if _, err := indicesDelete.Do(ctx); err != nil {
			stderr.Println("Remove all indices: ", err)
		} else {
			stdout.Printf("Completed removal of all indices")
		}
	} else {
		var s []string
		for i := idrange.From; i <= idrange.To; i++ {
			indexName := selastic.AccountIndex(strconv.Itoa(i))
			exists, err := esClient.IndexExists(indexName).Do(context.Background())
			if err != nil {
				stderr.Println("Failed to check existence of index: ", err)
			}
			if exists {
				s = append(s, indexName)
			}
		}

		if len(s) > 0 {
			indicesDelete.Index(s)
			if _, err := indicesDelete.Do(ctx); err != nil {
				stderr.Println("Remove listed indices: ", err)
			} else {
				stdout.Printf("Completed removal of indices: %v", s)
			}
		} else {
			stdout.Println("No indices found for listed account-ids")
		}
	}

	stdout.Println("Done!")
	return nil
}
