package service_test

import (
	"testing"

	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

var query_segments_index = "test_query_segments_index"

func TestAudience_Query_SegmentIds(t *testing.T) {
	//
	// Mongo
	//
	var (
		mdb              = dialMongo(t, *tMongoDSN)
		dynamic_segments = mdb.C("dynamic_segments")
	)

	truncateColl(t, dynamic_segments)

	// indexes
	// if err := mongodb.EnsureIndexes(mdb); err != nil {
	// 	t.Fatalf("EnsureIndexes: %v", err)
	// }

	loadFixture(t, dynamic_segments, "../testdata/dynamic_segments.json")

	//
	// ES
	//
	t.Log("\n\nElasticSearch Log:", elasticOut.Name(), "\n\n")

	var es5Client = newClient(t)

	es5Client.DeleteIndex(query_segments_index)
	es5Client.CreateIndex(query_segments_index)

	es5Client.createMapping(query_segments_index, "device", elastic.DeviceV2Mapping(M{}, M{}))

	es5Client.LoadBulk(string(readFile(t, "../elastic/testdata/query_segment_ids.bulk.json")))

	t.Run("Query_SegmentIds", testAudience_Query_SegmentIds)
}

func testAudience_Query_SegmentIds(t *testing.T) {
	var (
		es5Client = newClient(t)

		index = &elastic.Index{
			Client:    es5Client.c,
			IndexName: func(_ string) string { return query_segments_index },
		}

		db = mongodb.New(dialMongo(t, *tMongoDSN))

		svc = service.New(db, index, nil)

		scroll = &audience.QueryRequest_ScrollIterator_{
			ScrollIterator: &audience.QueryRequest_ScrollIterator{
				Operation: &audience.QueryRequest_ScrollIterator_StartScroll_{
					StartScroll: &audience.QueryRequest_ScrollIterator_StartScroll{
						BatchSize: 1001,
					},
				},
			},
		}
	)

	tcases := []struct {
		desc string
		req  *audience.QueryRequest

		exp expect
	}{
		{
			desc: "error: segments specified: but not found",
			exp: expect{
				expErr: status.Errorf(codes.FailedPrecondition, "db.ListDynamicSegmentsByIds: exp=1 got=0 segments"),
			},

			req: &audience.QueryRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Iterator:    scroll,

				Query: &audience.QueryRequest_QuerySegments_{
					QuerySegments: &audience.QueryRequest_QuerySegments{
						Condition: audience.PredicateAggregate_ALL,
						Ids:       []string{"not found"},
					},
				},
			},
		},

		{
			desc: "no segments specified: query all",
			req: &audience.QueryRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Iterator:    scroll,

				Query: &audience.QueryRequest_QuerySegments_{
					QuerySegments: &audience.QueryRequest_QuerySegments{
						Condition: audience.PredicateAggregate_ALL,
						Ids:       nil,
					},
				},
			},

			exp: expect{
				exp: &audience.QueryResponse{
					TotalSize: 4,
					ScrollId:  "", // unpredictable
					Devices: []*audience.Device{
						{DeviceId: "d4", ProfileIdentifier: ""},
						{DeviceId: "d3", ProfileIdentifier: "p1"},
						{DeviceId: "d1", ProfileIdentifier: "p1"},
						{DeviceId: "d2", ProfileIdentifier: "frank"},
					},
					Profiles: []*audience.Profile{
						{Identifier: "p1", AccountId: 1},
					},
				},
			},
		},

		{
			desc: "segments specified",
			req: &audience.QueryRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Iterator:    scroll,

				Query: &audience.QueryRequest_QuerySegments_{
					QuerySegments: &audience.QueryRequest_QuerySegments{
						Condition: audience.PredicateAggregate_ANY,
						Ids:       []string{"112000000000000000000000", "111000000000000000000000"},
					},
				},
			},

			exp: expect{
				exp: &audience.QueryResponse{
					TotalSize: 3,
					ScrollId:  "", // unpredictable
					Devices: []*audience.Device{
						{DeviceId: "d3", ProfileIdentifier: "p1"},
						{DeviceId: "d1", ProfileIdentifier: "p1"},
						{DeviceId: "d2", ProfileIdentifier: "frank"},
					},
					Profiles: []*audience.Profile{
						{Identifier: "p1", AccountId: 1},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp.exp, tc.exp.expErr
				got, gotErr = svc.Query(context.TODO(), tc.req)
			)

			if gotErr == nil {
				if got.ScrollId == "" {
					t.Fatal("scroll id must be set")
				}
				// blank it since it's unpredictable
				// and next comparison fails
				got.ScrollId = ""
			}

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}
