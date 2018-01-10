package elastic_test

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"testing"

	"golang.org/x/net/context"
	es5 "gopkg.in/olivere/elastic.v5"

	relastic "github.com/roverplatform/rover/audience/service/elastic"
)

var (
	elasticOut = mustCreateFile("elastic.test.log")
	elasticLog = log.New(elasticOut, "", 0)

	mongoDSN = "mongodb://mongo:27017/service_worker_test"
	esDSN    = "http://elastic5:9200/"
)

type (
	client struct {
		t *testing.T
		c *es5.Client
	}
)

func mustCreateFile(name string) *os.File {
	var f, err = os.Create(name)
	if err != nil {
		panic("audience.elastic.log:" + err.Error())
	}

	return f
}

func newClient(t *testing.T) *client {

	var esClient, err = es5.NewClient(
		es5.SetURL(strings.Split(esDSN, ",")...),
		es5.SetTraceLog(elasticLog),
		// es5.SetGzip(false),
	)

	if err != nil {
		t.Fatal("elastic.NewClient:", err)
	}

	return &client{t: t, c: esClient}
}

func (c *client) CreateIndex(name string) {
	c.t.Helper()
	if _, err := c.c.CreateIndex(name).Do(context.TODO()); err != nil {
		c.t.Fatal("index:", err)
	}
}

func (c *client) DeleteIndex(name string) {
	c.t.Helper()
	resp, err := c.c.PerformRequest(context.TODO(), "DELETE", "/"+name, nil, nil)
	if err != nil {
		if resp != nil && resp.StatusCode == 404 {
			return
		}
		c.t.Fatal("deleteIndex:", err)
	}
}

func (c *client) LoadBulk(body string) {
	c.t.Helper()

	var resp, err = c.c.PerformRequest(context.TODO(), "POST", "/_bulk?refresh=wait_for", nil, body)
	if err != nil {
		c.t.Fatal("elastic.PerformRequest:", err)
	}

	var esResp es5.BulkResponse
	if err := json.Unmarshal(resp.Body, &esResp); err != nil {
		c.t.Fatal("json.Unmarshal:", err)
	}

	if esResp.Errors {
		for _, item := range esResp.Failed() {
			c.t.Errorf("elastic.BulkResponse: index=%s id=%s error=%+v", item.Index, item.Id, item.Error)
		}
	}
}

func (c *client) createMapping(idx string, esType string, body relastic.M) {
	c.t.Helper()

	var m = c.c.PutMapping().
		Index(idx).
		Type(esType).
		BodyJson(body)

	if _, err := m.Do(context.TODO()); err != nil {
		c.t.Fatal("mapping:", err)
	}
}

func readFile(t *testing.T, fixturePath string) []byte {
	data, err := ioutil.ReadFile(fixturePath)
	if err != nil {
		t.Fatal("ReadFile:", err)
	}

	return data
}
