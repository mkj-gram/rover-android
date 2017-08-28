package main

import (
	"flag"
	"fmt"
	"golang.org/x/net/context"
	"log"
	"os"
	"strconv"
	"strings"

	selastic "github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	mgo "gopkg.in/mgo.v2"
	elastic "gopkg.in/olivere/elastic.v5"
)

var (
	esDSN    = flag.String("elastic-DSN", "", "comma-separated list of ES URLs (e.g. 'http://192.168.2.10:9200,http://192.168.2.11:9200')")
	mongoDSN = flag.String("mongo-DSN", "", "mongo DB Data Source Name")

	idrange = IdRange("account-ids", "account ids to create indexes for")
)

var (
	stdout = log.New(os.Stdout, "", 0)
	stderr = log.New(os.Stderr, "stderr: ", 0)
	eslog  = log.New(os.Stderr, "elastic: ", 0)
)

func main() {
	flag.Parse()

	if idrange.Blank() {
		stderr.Fatalln("invalid range:", idrange)
	}

	stdout.Println("creating indexes for account ids:", idrange.String())

	esClient, err := elastic.NewClient(
		elastic.SetURL(strings.Split(*esDSN, ",")...),
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
		sess, info = dialMongo(*mongoDSN)
		db         = sess.DB(info.Database)

		ctx = context.Background()

		accountAttrs = getProfileSchemas(db)

		deviceMapping = selastic.DeviceMapping()
	)

	for i := idrange.From; i <= idrange.To; i++ {
		indexName := selastic.AccountIndex(strconv.Itoa(i))
		_, err := esClient.CreateIndex(indexName).Do(ctx)
		if err != nil {
			stderr.Fatalf("account[%d]: %v", i, err)
		}

		var (
			attrMapping    = selastic.ProfileAttributesMapping(accountAttrs[i])
			profileMapping = selastic.ProfileMapping(attrMapping)
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
}

func dialMongo(dsn string) (*mgo.Session, *mgo.DialInfo) {
	dialInfo, err := mongodb.ParseURL(dsn)
	if err != nil {
		stderr.Fatalln("mongodb:", err)
	}

	sess, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		stderr.Fatalf("mgo.Dial: DSN=%q error=%q", dsn, err)
	}

	return sess, dialInfo
}

func getProfileSchemas(db *mgo.Database) map[int][]*mongodb.SchemaAttribute {
	var (
		attrs []*mongodb.SchemaAttribute
		m     = make(map[int][]*mongodb.SchemaAttribute)
	)

	err := db.C("profiles_schemas").Find(nil).Sort("account_id").All(&attrs)
	if err != nil {
		stderr.Fatalln("mongo.Find:", err)
	}

	for _, attr := range attrs {
		m[int(attr.AccountId)] = append(m[int(attr.AccountId)], attr)
	}

	return m
}

//
//
var _ flag.Value = (*idRange)(nil)

type idRange struct {
	From, To int
}

func (r *idRange) String() string {
	return fmt.Sprintf("%d-%d", r.From, r.To)
}

func (r *idRange) Set(s string) error {
	parts := strings.Split(s, "-")
	if l := len(parts); l == 0 || l > 2 {
		return fmt.Errorf("invalid range: %s", s)
	}

	if len(parts) == 1 {
		parts = append(parts, parts[0])
	}

	var err error

	r.From, err = strconv.Atoi(parts[0])
	if err != nil {
		return fmt.Errorf("invalid from: %v", parts[0])
	}

	r.To, err = strconv.Atoi(parts[1])
	if err != nil {
		return fmt.Errorf("invalid from: %v", parts[1])
	}

	return nil
}

func (r *idRange) Blank() bool {
	return r.String() == "-"
}

func IdRange(name, desc string) *idRange {
	var r idRange
	flag.Var(&r, name, desc)
	return &r
}
