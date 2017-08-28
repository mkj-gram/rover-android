// +build integration

package service_test

import (
	"context"
	"testing"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/go/log"
)

var (
	_ = log.NewLog
)

func predicateAggregate(t *testing.T) []*audience.Predicate {
	return []*audience.Predicate{
		{&audience.Predicate_BoolPredicate{&audience.BoolPredicate{
			AttributeName: "is_bluetooth_enabled",
			Op:            audience.BoolPredicate_IS_EQUAL,
			Value:         true,
		}}},
		{&audience.Predicate_StringPredicate{&audience.StringPredicate{
			AttributeName: "first_name",
			Op:            audience.StringPredicate_IS_EQUAL,
			Value:         "hello world",
		}}},
		{&audience.Predicate_NumberPredicate{&audience.NumberPredicate{
			AttributeName: "age",
			Op:            audience.NumberPredicate_IS_BETWEEN,
			Value:         20, Value2: 40,
		}}},
		{&audience.Predicate_VersionPredicate{&audience.VersionPredicate{
			AttributeName: "age",
			Op:            audience.VersionPredicate_IS_BETWEEN,
			Value:         &audience.Version{1, 2, 3},
			Value2:        &audience.Version{2, 3, 4},
		}}},
		{&audience.Predicate_DatePredicate{&audience.DatePredicate{
			AttributeName: "created_at",
			Op:            audience.DatePredicate_IS_BETWEEN,
			Value:         protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
			Value2:        protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
		}}},
		{&audience.Predicate_GeofencePredicate{&audience.GeofencePredicate{
			AttributeName: "location",
			Op:            audience.GeofencePredicate_IS_SET,
			Value:         &audience.GeofencePredicate_Location{Latitude: 43.650673, Longitude: -79.378519, Radius: 250, Name: "McDonald's On Yonge St"},
		}}},
	}

}

func testAudienceService_CreateDynamicSegment(t *testing.T) {
	var (
		ctx      = context.TODO()
		objectId = tNewObjectIdFunc(t, 0)

		createdAt = parseTime(t, "2016-11-11T00:00:00.111Z")
		timeNow   = func() time.Time { return createdAt }

		db = mongodb.New(dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(objectId),
			mongodb.WithTimeFunc(timeNow),
		)

		svc = service.New(db)

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string

		req *audience.CreateDynamicSegmentRequest

		exp    *audience.CreateDynamicSegmentResponse
		expErr error
	}{
		{
			name: "creates a segment",

			req: &audience.CreateDynamicSegmentRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Title:       "a segment",
				PredicateAggregate: &audience.PredicateAggregate{
					Condition:  audience.PredicateAggregate_ALL,
					Predicates: predicateAggregate(t),
				},
			},

			exp: &audience.CreateDynamicSegmentResponse{
				&audience.DynamicSegment{
					Id:         "0194fdc2fa2ffcc041d3ff12",
					AccountId:  1,
					Title:      "a segment",
					IsArchived: false,

					CreatedAt: protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),

					PredicateAggregate: &audience.PredicateAggregate{
						Condition:  audience.PredicateAggregate_ALL,
						Predicates: predicateAggregate(t),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.CreateDynamicSegment(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}

}

func testAudienceService_GetDynamicSegmentById(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db)

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	// mongodb.Log.SetLevel(log.Debug)
	// defer func() { mongodb.Log.SetLevel(log.Error) }()

	defer teardown()

	type tCase struct {
		name string
		req  *audience.GetDynamicSegmentByIdRequest

		expErr error
		exp    *audience.GetDynamicSegmentByIdResponse
	}

	tcases := []tCase{
		{
			name: "error: segment_id: unset",
			req: &audience.GetDynamicSegmentByIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "",
			},

			expErr: status.Errorf(codes.InvalidArgument, "Validation: SegmentId: blank"),
		},

		{
			name: "error: wrong account",
			req: &audience.GetDynamicSegmentByIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				SegmentId:   "000000000000000000000002",
			},

			expErr: status.Errorf(codes.NotFound, "db.GetDynamicSegmentById: dynamic_segments.Find: not found"),
		},

		{
			name: "finds previously created segment",
			req: &audience.GetDynamicSegmentByIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "0194fdc2fa2ffcc041d3ff12",
			},

			expErr: nil,
			exp: &audience.GetDynamicSegmentByIdResponse{
				&audience.DynamicSegment{
					Id:          "0194fdc2fa2ffcc041d3ff12",
					AccountId:   1,
					Title:       "a segment",
					IsArchived:  false,
					SegmentSize: 0,

					CreatedAt: protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),

					PredicateAggregate: &audience.PredicateAggregate{
						Condition:  audience.PredicateAggregate_ALL,
						Predicates: predicateAggregate(t),
					},
				},
			},
		},

		{
			name: "finds a segment",
			req: &audience.GetDynamicSegmentByIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "000000000000000000000002",
			},

			expErr: nil,
			exp: &audience.GetDynamicSegmentByIdResponse{
				&audience.DynamicSegment{
					Id:          "000000000000000000000002",
					AccountId:   1,
					Title:       "a segment",
					IsArchived:  true,
					SegmentSize: 9001,

					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},
		},

		{
			name: "finds the segment with predicates and doesn't fail",
			req: &audience.GetDynamicSegmentByIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "000000000000000000000020",
			},

			expErr: nil,
			exp: &audience.GetDynamicSegmentByIdResponse{
				&audience.DynamicSegment{
					Id:          "000000000000000000000020",
					AccountId:   1,
					Title:       "zero value predicates",
					IsArchived:  false,
					SegmentSize: 9001,
					CreatedAt:   protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt:   protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),

					PredicateAggregate: &audience.PredicateAggregate{
						Condition: audience.PredicateAggregate_ALL,
						Predicates: []*audience.Predicate{
							{&audience.Predicate_BoolPredicate{&audience.BoolPredicate{}}},
							{&audience.Predicate_StringPredicate{&audience.StringPredicate{}}},
							{&audience.Predicate_NumberPredicate{&audience.NumberPredicate{}}},
							{&audience.Predicate_DatePredicate{&audience.DatePredicate{}}},
							{&audience.Predicate_VersionPredicate{&audience.VersionPredicate{}}},
							{&audience.Predicate_GeofencePredicate{&audience.GeofencePredicate{}}},
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.GetDynamicSegmentById(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_UpdateDynamicSegmentTitle(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db)

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDynamicSegmentTitleRequest

		expErr error
		exp    *audience.DynamicSegment

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: segment_id: unset",
			req: &audience.UpdateDynamicSegmentTitleRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Title:       "a new title",
			},

			expErr: status.Errorf(codes.InvalidArgument, "Validation: SegmentId: blank"),
		},

		{
			name: "error: wrong account",
			req: &audience.UpdateDynamicSegmentTitleRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				SegmentId:   "000000000000000000000001",
				Title:       "a new title",
			},

			expErr: status.Errorf(codes.NotFound, "db.UpdateDynamicSegmentTitle: dynamic_segments.Update: not found"),
		},

		{
			name: "updates segment's title",
			req: &audience.UpdateDynamicSegmentTitleRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "000000000000000000000001",
				Title:       "a new title",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.DynamicSegment{
					Id:        "000000000000000000000001",
					AccountId: 1,
					Title:     "a title",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.DynamicSegment{
					Id:        "000000000000000000000001",
					AccountId: 1,
					Title:     "a new title",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDynamicSegmentById(ctx, tc.req.GetSegmentId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDynamicSegmentTitle(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDynamicSegmentById(ctx, tc.req.GetSegmentId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDynamicSegmentArchiveStatus(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db)

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDynamicSegmentArchiveStatusRequest

		expErr error

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: segment_id: unset",
			req: &audience.UpdateDynamicSegmentArchiveStatusRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "",
			},

			expErr: status.Errorf(codes.InvalidArgument, "Validation: SegmentId: blank"),
		},

		{
			name: "error: wrong account",
			req: &audience.UpdateDynamicSegmentArchiveStatusRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				SegmentId:   "000000000000000000000003",
				Archived:    true,
			},

			expErr: status.Errorf(codes.NotFound, "db.UpdateDynamicSegmentArchiveStatus: dynamic_segments.Update: not found"),
		},

		{
			name: "updates segment",
			req: &audience.UpdateDynamicSegmentArchiveStatusRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "000000000000000000000003",
				Archived:    true,
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.DynamicSegment{
					Id:         "000000000000000000000003",
					AccountId:  1,
					IsArchived: false,
					Title:      "a title",
					CreatedAt:  protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt:  protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.DynamicSegment{
					Id:         "000000000000000000000003",
					AccountId:  1,
					IsArchived: true,
					Title:      "a title",
					CreatedAt:  protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt:  protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDynamicSegmentById(ctx, tc.req.GetSegmentId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDynamicSegmentArchiveStatus(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDynamicSegmentById(ctx, tc.req.GetSegmentId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDynamicSegmentPredicates(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db)

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDynamicSegmentPredicatesRequest

		expErr error

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: segment_id: unset",
			req: &audience.UpdateDynamicSegmentPredicatesRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "",
			},

			expErr: status.Errorf(codes.InvalidArgument, "Validation: SegmentId: blank"),
		},

		{
			name: "error: wrong account",
			req: &audience.UpdateDynamicSegmentPredicatesRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				SegmentId:   "000000000000000000000004",
			},

			expErr: status.Errorf(codes.NotFound, "db.UpdateDynamicSegmentPredicates: dynamic_segments.Update: not found"),
		},

		{
			name: "updates segment",
			req: &audience.UpdateDynamicSegmentPredicatesRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				SegmentId:   "000000000000000000000004",

				PredicateAggregate: &audience.PredicateAggregate{
					Condition:  audience.PredicateAggregate_ALL,
					Predicates: predicateAggregate(t),
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.DynamicSegment{
					Id:         "000000000000000000000004",
					AccountId:  1,
					IsArchived: false,
					Title:      "with predicates",
					CreatedAt:  protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt:  protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.DynamicSegment{
					Id:         "000000000000000000000004",
					AccountId:  1,
					IsArchived: false,
					Title:      "with predicates",
					CreatedAt:  protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt:  protoTs(t, updatedAt),

					PredicateAggregate: &audience.PredicateAggregate{
						Condition:  audience.PredicateAggregate_ALL,
						Predicates: predicateAggregate(t),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDynamicSegmentById(ctx, tc.req.GetSegmentId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDynamicSegmentPredicates(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDynamicSegmentById(ctx, tc.req.GetSegmentId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_ListDynamicSegments(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db)

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.ListDynamicSegmentsRequest

		expErr error
		exp    *audience.ListDynamicSegmentsResponse
	}

	tcases := []tCase{
		{
			name: "filters by account",
			req: &audience.ListDynamicSegmentsRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
			},

			exp: &audience.ListDynamicSegmentsResponse{
				Segments: nil,
			},
		},

		{
			name: "lists the segments",
			req: &audience.ListDynamicSegmentsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
			},

			expErr: nil,
			exp: &audience.ListDynamicSegmentsResponse{
				Segments: []*audience.DynamicSegment{
					{
						Id:          "000000000000000000000010",
						AccountId:   2,
						Title:       "a segment",
						IsArchived:  true,
						SegmentSize: 9001,

						CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
					},
					{
						Id:          "000000000000000000000011",
						AccountId:   2,
						Title:       "a title",
						IsArchived:  false,
						SegmentSize: 0,

						CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.ListDynamicSegments(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}
