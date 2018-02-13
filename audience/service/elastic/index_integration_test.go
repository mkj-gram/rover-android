// +build integration

package elastic_test

import (
	"testing"

	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	rtesting "github.com/roverplatform/rover/go/testing"
)

const (
	test_index         = "test_index"
	suggest_test_index = "suggestion_test_index"
)

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
	idxName = func(s string) string {
		return "test_account_" + s
	}

	difff = rtesting.Difff
	Diff  = rtesting.Diff
)

func TestQuery(t *testing.T) {
	t.Log("\n\nElasticSearch Log:", elasticOut.Name(), "\n\n")

	var es5Client = newClient(t)

	es5Client.DeleteIndex(test_index)
	es5Client.CreateIndex(test_index)

	es5Client.createMapping(test_index, "device", elastic.DeviceV2Mapping(M{}, M{}))

	es5Client.LoadBulk(string(readFile(t, "testdata/basic.bulk.json")))

	t.Run("TestQuery_misc", test_Query_misc)
	t.Run("TestQuery_Pager", test_Query_Pager)
	t.Run("TestQuery_Scroller", test_Query_Scroller)
	t.Run("TestQuery_Scroller_Parallell", test_Query_ScrollerParallell)
}

func test_Query_misc(t *testing.T) {
	var (
		es5Client = newClient(t)

		index = &elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}

		svc = service.New(nil, index, nil)
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
				got, gotErr = svc.Query(context.TODO(), tc.req)
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

		index = &elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}

		svc = service.New(nil, index, nil)
	)

	tcases := []struct {
		desc string
		req  *audience.QueryRequest

		exp expect
	}{
		{
			req: newRequest(t, nil),

			exp: expect{
				err: status.Errorf(codes.Internal, "Index.Query: GetIterator: nil iterator: invalid argument"),
			},
		},

		{
			desc: "pager: first page",
			req:  newRequest(t, pager{Page: 0, Size: 3}),

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d4", ProfileIdentifier: ""},
						{DeviceId: "d3", ProfileIdentifier: "p1"},
						{DeviceId: "d1", ProfileIdentifier: "p1"},
					},
					Profiles: []*audience.Profile{
						{Identifier: "p1", AccountId: 1},
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
						{DeviceId: "d2", ProfileIdentifier: "frank"},
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
				got, gotErr = svc.Query(context.TODO(), tc.req)
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

		index = &elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}

		svc = service.New(nil, index, nil)

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
						{DeviceId: "d4", ProfileIdentifier: ""},
						{DeviceId: "d3", ProfileIdentifier: "p1"},
						{DeviceId: "d1", ProfileIdentifier: "p1"},
					},
					Profiles: []*audience.Profile{
						{Identifier: "p1", AccountId: 1},
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
						{DeviceId: "d2", ProfileIdentifier: "frank"},
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
				got, gotErr = svc.Query(context.TODO(), newRequest(t, tc.req))
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

		index = &elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return test_index },
		}

		svc = service.New(nil, index, nil)

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
				StreamId:   0,
				MaxStreams: 2,
				BatchSize:  1,
			},

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d4", ProfileIdentifier: ""},
					},
					TotalSize: 3,
				},
			},
		},
		{
			desc: "scroller: next page",
			req:  scrollNext{ScrollId: lastScrollId},

			exp: expect{
				val: &audience.QueryResponse{
					Devices: []*audience.Device{
						{DeviceId: "d1", ProfileIdentifier: "p1"},
					},
					Profiles: []*audience.Profile{
						{Identifier: "p1", AccountId: 1},
					},
					TotalSize: 3,
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
				got, gotErr = svc.Query(context.TODO(), newRequest(t, tc.req))
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

func newRequest(t *testing.T, i interface{}) *audience.QueryRequest {
	var pa = &audience.PredicateAggregate{
		Condition:  audience.PredicateAggregate_ALL,
		Predicates: []*audience.Predicate{},
	}

	switch v := i.(type) {
	case nil:
		return &audience.QueryRequest{
			AuthContext: &auth.AuthContext{AccountId: 1},
			Query:       &audience.QueryRequest_Predicate{Predicate: pa},
			Iterator:    nil,
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
			AuthContext: &auth.AuthContext{AccountId: 1},
			Query:       &audience.QueryRequest_Predicate{Predicate: pa},
			Iterator:    iter,
		}
	case pager:
		iter := &audience.QueryRequest_PageIterator_{
			&audience.QueryRequest_PageIterator{
				Page: v.Page, Size: v.Size,
			}}

		return &audience.QueryRequest{
			AuthContext: &auth.AuthContext{AccountId: 1},
			Iterator:    iter,
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
			AuthContext: &auth.AuthContext{AccountId: 1},
			Iterator:    iter,
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
			AuthContext: &auth.AuthContext{AccountId: 1},
			Iterator:    iter,
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
			AuthContext: &auth.AuthContext{AccountId: 1},
			Iterator:    iter,
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
			AuthContext: &auth.AuthContext{AccountId: 1},
			Iterator:    iter,
		}
	default:
		t.Fatalf("unknown type: %T", v)
	}

	return nil
}

func getFieldSuggestionRequest(t *testing.T, s audience.GetFieldSuggestionRequest_Selector, f string, i int64) *audience.GetFieldSuggestionRequest {
	return &audience.GetFieldSuggestionRequest{
		AuthContext: &auth.AuthContext{AccountId: 1},
		Selector:    s,
		Field:       f,
		Size:        i,
	}
}

func TestGetFieldSuggestion(t *testing.T) {
	var (
		profileCustomAttributesMapping = M{"custom_attribute_1": M{"type": "keyword"}, "custom_attribute_2": M{"type": "keyword"}}
		deviceCustomAttributesMapping  = M{"device_attribute_1": M{"type": "keyword"}}

		es5Client = newClient(t)
	)

	es5Client.DeleteIndex(suggest_test_index)
	es5Client.CreateIndex(suggest_test_index)

	es5Client.createMapping(suggest_test_index, "device", elastic.DeviceV2Mapping(deviceCustomAttributesMapping, profileCustomAttributesMapping))

	es5Client.LoadBulk(string(readFile(t, "testdata/suggestions.bulk.json")))

	var (
		index = &elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return suggest_test_index },
		}

		svc = service.New(nil, index, nil)
	)

	tcases := []struct {
		desc string
		req  *audience.GetFieldSuggestionRequest

		exp expect
	}{
		{
			desc: "no results",
			req:  getFieldSuggestionRequest(t, audience.GetFieldSuggestionRequest_DEVICE, "test_field", 10),
			exp: expect{
				val: &audience.GetFieldSuggestionResponse{},
			},
		},
		{
			desc: "One result",
			req:  getFieldSuggestionRequest(t, audience.GetFieldSuggestionRequest_DEVICE, "locale_script", 10),
			exp: expect{
				val: &audience.GetFieldSuggestionResponse{
					Suggestions: []string{"result1"},
				},
			},
		},
		{
			desc: "Many results, limited to two",
			req:  getFieldSuggestionRequest(t, audience.GetFieldSuggestionRequest_DEVICE, "app_name", 2),
			exp: expect{
				val: &audience.GetFieldSuggestionResponse{
					Suggestions: []string{"another app name", "a third app name"},
				},
			},
		},
		{
			desc: "Rover Profile suggestions",
			req:  getFieldSuggestionRequest(t, audience.GetFieldSuggestionRequest_ROVER_PROFILE, "identifier", 10),
			exp: expect{
				val: &audience.GetFieldSuggestionResponse{
					Suggestions: []string{"profile_sp2_identifier", "profile_sp1_identifier"},
				},
			},
		},
		{
			desc: "Custom profile suggestions",
			req:  getFieldSuggestionRequest(t, audience.GetFieldSuggestionRequest_CUSTOM_PROFILE, "custom_attribute_1", 10),
			exp: expect{
				val: &audience.GetFieldSuggestionResponse{
					Suggestions: []string{"another", "custom string"},
				},
			},
		},
		{
			desc: "Custom device suggestions",
			req:  getFieldSuggestionRequest(t, audience.GetFieldSuggestionRequest_CUSTOM_DEVICE, "device_attribute_1", 10),
			exp: expect{
				val: &audience.GetFieldSuggestionResponse{
					Suggestions: []string{"water", "wine"},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp.val, tc.exp.err
				got, gotErr = svc.GetFieldSuggestion(context.TODO(), tc.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}

}
