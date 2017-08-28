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

var _ = log.NewLog

func testAudienceService_GetDevicesTotalCount(t *testing.T) {
	var (
		ctx      = context.TODO()
		objectId = tNewObjectIdFunc(t, 0)

		createdAt = parseTime(t, "2016-11-11T00:00:00.111Z")
		timeNow   = func() time.Time { return createdAt }

		db = mongodb.New(dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(objectId),
			mongodb.WithTimeFunc(timeNow),
		)

		svc = service.New(db, logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string

		req    *audience.GetDevicesTotalCountRequest
		exp    *audience.GetDevicesTotalCountResponse
		expErr error
	}{
		{
			name: "error: not found: account",

			req: &audience.GetDevicesTotalCountRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
			},

			expErr: status.Errorf(codes.NotFound, "db.GetDevicesTotalCount: devices_counts: coll.FindId: not found"),
		},

		{
			name: "pulls the count",

			req: &audience.GetDevicesTotalCountRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
			},

			exp: &audience.GetDevicesTotalCountResponse{
				// this test is probably fragile
				Total: 8,
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.GetDevicesTotalCount(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_GetProfilesTotalCount(t *testing.T) {
	var (
		ctx      = context.TODO()
		objectId = tNewObjectIdFunc(t, 0)

		createdAt = parseTime(t, "2016-11-11T00:00:00.111Z")
		timeNow   = func() time.Time { return createdAt }

		db = mongodb.New(dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(objectId),
			mongodb.WithTimeFunc(timeNow),
		)

		svc = service.New(db, logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string

		req    *audience.GetProfilesTotalCountRequest
		exp    *audience.GetProfilesTotalCountResponse
		expErr error
	}{
		{
			name: "error: not found: account",

			req: &audience.GetProfilesTotalCountRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
			},

			expErr: status.Errorf(codes.NotFound, "db.GetProfilesTotalCount: profiles_counts: coll.FindId: not found"),
		},

		{
			name: "pulls the count",

			req: &audience.GetProfilesTotalCountRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
			},

			exp: &audience.GetProfilesTotalCountResponse{
				Total: 7,
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.GetProfilesTotalCount(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}
