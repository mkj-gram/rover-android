// +build integration

package elastic_test

import (
	"io/ioutil"
	"log"
	"os"
	"strings"
	"testing"

	"github.com/pkg/errors"
	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service/elastic"
	rlog "github.com/roverplatform/rover/go/log"
	rtesting "github.com/roverplatform/rover/go/testing"
	"golang.org/x/net/context"
	es5 "gopkg.in/olivere/elastic.v5"
)

const test_index = "test_index"

type (
	M = map[string]interface{}

	expect struct {
		err error
		val interface{}
	}

	response struct {
		Code int
		Body M
	}

	client struct {
		c *es5.Client
	}

	pager             = audience.QueryRequest_PageIterator
	scroller          = audience.QueryRequest_ScrollIterator_StartScroll
	scrollerParallell = audience.QueryRequest_ScrollIterator_StartParallelScroll

	scrollNext struct {
		ScrollId *string
	}

	clear struct {
		ScrollId *string
	}
)

var (
	_ = ioutil.Discard

	l    = log.New(os.Stdout, "elastic:", 0)
	rLog = rlog.New(rlog.Error)

	idxName = func(s string) string {
		return "test_account_" + s
	}

	mongoDSN = "mongodb://mongo:27017/service_worker_test"
	esDSN    = "http://elastic5:9200/"

	difff = rtesting.Difff
	Diff  = rtesting.Diff
)

func TestQuery(t *testing.T) {
	es5Client := newClient(t)

	es5Client.DeleteIndex(t, test_index)
	es5Client.CreateIndex(t, test_index)

	es5Client.createMapping(t, test_index, "device", elastic.DeviceMapping())
	es5Client.createMapping(t, test_index, "profile", elastic.ProfileMapping(M{}))

	es5Client.LoadBulk(t, string(readFile(t, "testdata/basic.bulk.json")))

	t.Run("TestQuery_misc", test_Query_misc)
	t.Run("TestQuery_Pager", test_Query_Pager)
	t.Run("TestQuery_Scroller", test_Query_Scroller)
	t.Run("TestQuery_Scroller_Parallell", test_Query_ScrollerParallell)
}

func test_Query_misc(t *testing.T) {
	var (
		es5Client = newClient(t)

		index = elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}
	)

	tcases := []struct {
		desc string
		req  *audience.QueryRequest

		exp expect
	}{
		{
			desc: "misc: no results",
			req:  newRequest(t, "none"),

			exp: expect{
				val: &audience.QueryResponse{},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp.val, tc.exp.err
				got, gotErr = index.Query(context.TODO(), tc.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_Query_Pager(t *testing.T) {
	var (
		es5Client = newClient(t)

		index = elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}
	)

	tcases := []struct {
		desc string
		req  *audience.QueryRequest

		exp expect
	}{
		{
			req: newRequest(t, nil),

			exp: expect{
				err: errors.Wrap(elastic.InvalidArgument, "GetIterator: nil iterator"),
			},
		},

		{
			desc: "pager: first page",
			req:  newRequest(t, pager{Page: 0, Size: 3}),

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d2", ProfileId: "p2"},
						{DeviceId: "d4", ProfileId: "p2"},
						{DeviceId: "d1", ProfileId: "p1"},
					},
					Profiles: []*audience.Profile{
						{Id: "p2", AccountId: 1},
						{Id: "p2", AccountId: 1},
						{Id: "p1", AccountId: 1},
					},
					TotalSize: 4,
				},
			},
		},
		{
			desc: "pager: next page",
			req:  newRequest(t, pager{Page: 1, Size: 3}),

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d3", ProfileId: "p1"},
					},
					Profiles: []*audience.Profile{
						{Id: "p1", AccountId: 1},
					},
					TotalSize: 4,
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp.val, tc.exp.err
				got, gotErr = index.Query(context.TODO(), tc.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_Query_Scroller(t *testing.T) {
	var (
		es5Client = newClient(t)

		index = elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}

		ptr string

		lastScrollId = &ptr
	)

	tcases := []struct {
		desc string
		req  interface{}

		exp expect
	}{
		{
			desc: "scroller: first page",
			req:  scroller{BatchSize: 3},

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d2", ProfileId: "p2"},
						{DeviceId: "d1", ProfileId: "p1"},
						{DeviceId: "d4", ProfileId: "p2"},
					},
					Profiles: []*audience.Profile{
						{Id: "p2", AccountId: 1},
						{Id: "p1", AccountId: 1},
						{Id: "p2", AccountId: 1},
					},
					TotalSize: 4,
				},
			},
		},
		{
			desc: "scroller: next page",
			req:  scrollNext{ScrollId: lastScrollId},

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d3", ProfileId: "p1"},
					},
					Profiles: []*audience.Profile{
						{Id: "p1", AccountId: 1},
					},
					TotalSize: 4,
				},
			},
		},
		{
			desc: "scroller: clear",
			req:  clear{ScrollId: lastScrollId},

			exp: expect{
				val: &audience.QueryResponse{},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp.val, tc.exp.err
				got, gotErr = index.Query(context.TODO(), newRequest(t, tc.req))
			)

			*lastScrollId = got.ScrollId
			// NOTE: it's unpredictable
			got.ScrollId = ""

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_Query_ScrollerParallell(t *testing.T) {
	var (
		es5Client = newClient(t)

		index = elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}

		ptr string

		lastScrollId = &ptr
	)

	tcases := []struct {
		desc string
		req  interface{}

		exp expect
	}{
		{
			desc: "scroller: first page",
			req: scrollerParallell{
				MaxStreams: 2,
				StreamId:   1,
				BatchSize:  1,
			},

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d2", ProfileId: "p2"},
					},
					Profiles: []*audience.Profile{
						{Id: "p2", AccountId: 1},
					},
					TotalSize: 2,
				},
			},
		},
		{
			desc: "scroller: next page",
			req:  scrollNext{ScrollId: lastScrollId},

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d4", ProfileId: "p2"},
					},
					Profiles: []*audience.Profile{
						{Id: "p2", AccountId: 1},
					},
					TotalSize: 2,
				},
			},
		},
		{
			desc: "scroller: clear",
			req:  clear{ScrollId: lastScrollId},

			exp: expect{
				val: &audience.QueryResponse{},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp.val, tc.exp.err
				got, gotErr = index.Query(context.TODO(), newRequest(t, tc.req))
			)

			*lastScrollId = got.ScrollId
			// NOTE: it's unpredictable
			got.ScrollId = ""

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func newClient(t *testing.T) *client {
	esClient, err := es5.NewClient(
		es5.SetURL(strings.Split(esDSN, ",")...),
		es5.SetTraceLog(l),
		// es5.SetGzip(false),
	)
	if err != nil {
		t.Fatal("elastic.NewClient:", err)
	}

	return &client{esClient}
}

func (c *client) CreateIndex(t *testing.T, name string) {
	t.Helper()
	if _, err := c.c.CreateIndex(name).Do(context.TODO()); err != nil {
		t.Fatal("index:", err)
	}
}

func (c *client) DeleteIndex(t *testing.T, name string) {
	t.Helper()
	resp, err := c.c.PerformRequest(context.TODO(), "DELETE", "/"+name, nil, nil)
	if err != nil {
		if resp != nil && resp.StatusCode == 404 {
			return
		}
		t.Fatal("deleteIndex:", err)
	}
}

func (c *client) LoadBulk(t *testing.T, body string) {
	t.Helper()
	if _, err := c.c.PerformRequest(context.TODO(), "POST", "/_bulk?refresh=wait_for", nil, body); err != nil {
		t.Fatal("loadBulk:", err)
	}
}

func (c *client) createMapping(t *testing.T, idx string, esType string, body M) {
	t.Helper()

	var m = c.c.PutMapping().
		Index(idx).
		Type(esType).
		BodyJson(body)

	if _, err := m.Do(context.TODO()); err != nil {
		t.Fatal("mapping:", err)
	}
}

func readFile(t *testing.T, fixturePath string) []byte {
	data, err := ioutil.ReadFile(fixturePath)
	if err != nil {
		t.Fatal("ReadFile:", err)
	}

	return data
}

func newRequest(t *testing.T, i interface{}) *audience.QueryRequest {
	var pa = &audience.PredicateAggregate{
		Condition:  audience.PredicateAggregate_ALL,
		Predicates: []*audience.Predicate{},
	}

	switch v := i.(type) {
	case nil:
		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           nil,
		}
	case string:
		// Build a scroll that returns no results
		if v == "none" {
			var p = &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						AttributeName: "non-existent",
						Op:            audience.StringPredicate_IS_EQUAL,
						Value:         "non-existant",
					},
				},
			}
			pa.Predicates = append(pa.Predicates, p)
		}

		iter := &audience.QueryRequest_ScrollIterator_{
			ScrollIterator: &audience.QueryRequest_ScrollIterator{
				Operation: &audience.QueryRequest_ScrollIterator_StartScroll_{
					StartScroll: &audience.QueryRequest_ScrollIterator_StartScroll{
						BatchSize: 100,
					},
				},
			},
		}

		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           iter,
		}
	case pager:
		iter := &audience.QueryRequest_PageIterator_{
			&audience.QueryRequest_PageIterator{
				Page: v.Page, Size: v.Size,
			}}

		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           iter,
		}
	case scroller:
		iter := &audience.QueryRequest_ScrollIterator_{
			ScrollIterator: &audience.QueryRequest_ScrollIterator{
				Operation: &audience.QueryRequest_ScrollIterator_StartScroll_{
					StartScroll: &audience.QueryRequest_ScrollIterator_StartScroll{
						BatchSize: v.BatchSize,
					},
				},
			},
		}

		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           iter,
		}
	case scrollerParallell:
		iter := &audience.QueryRequest_ScrollIterator_{
			ScrollIterator: &audience.QueryRequest_ScrollIterator{
				Operation: &audience.QueryRequest_ScrollIterator_StartParallelScroll_{
					StartParallelScroll: &v,
				},
			},
		}

		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           iter,
		}
	case scrollNext:
		iter := &audience.QueryRequest_ScrollIterator_{
			ScrollIterator: &audience.QueryRequest_ScrollIterator{
				Operation: &audience.QueryRequest_ScrollIterator_Next_{
					Next: &audience.QueryRequest_ScrollIterator_Next{
						ScrollId: *v.ScrollId,
					},
				},
			},
		}

		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           iter,
		}

	case clear:
		iter := &audience.QueryRequest_ScrollIterator_{
			ScrollIterator: &audience.QueryRequest_ScrollIterator{
				Operation: &audience.QueryRequest_ScrollIterator_Clear_{
					Clear: &audience.QueryRequest_ScrollIterator_Clear{
						ScrollId: *v.ScrollId,
					},
				},
			},
		}

		return &audience.QueryRequest{
			AuthContext:        &auth.AuthContext{AccountId: 1},
			PredicateAggregate: pa,
			Iterator:           iter,
		}
	default:
		t.Fatalf("unknown type: %T", v)
	}

	return nil
}
