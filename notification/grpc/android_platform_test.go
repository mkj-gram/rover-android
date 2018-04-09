package grpc_test

import (
	"context"
	"testing"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	postgres "github.com/roverplatform/rover/notification/postgres"

	authpb "github.com/roverplatform/rover/apis/go/auth/v1"
	notificationpb "github.com/roverplatform/rover/apis/go/notification/v1"
	notification_grpc "github.com/roverplatform/rover/notification/grpc"
)

func test_Android_GetPlatform(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = notification_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		AndroidPlatform *postgres.AndroidPlatform
		err             error
	}

	tests := []struct {
		desc string

		req *notificationpb.GetAndroidPlatformRequest
		exp *notificationpb.GetAndroidPlatformResponse

		expErr error
	}{
		{
			desc:   "error: validations",
			req:    &notificationpb.GetAndroidPlatformRequest{},
			expErr: status.Errorf(codes.InvalidArgument, "validations: auth_ctx.account_id: is required. android_platform_id: is required."),
		},

		{
			desc: "error: not found",

			req: &notificationpb.GetAndroidPlatformRequest{
				AuthContext:       &authpb.AuthContext{AccountId: 1},
				AndroidPlatformId: 404,
			},

			expErr: status.Errorf(codes.NotFound, "Get: Query: sql: no rows in result set"),
		},

		{
			desc: "error: not found: account mismatch",

			req: &notificationpb.GetAndroidPlatformRequest{
				AuthContext:       &authpb.AuthContext{AccountId: 404},
				AndroidPlatformId: 1,
			},

			expErr: status.Errorf(codes.NotFound, "not found"),
		},

		{
			desc: "gets the Android_platform",

			req: &notificationpb.GetAndroidPlatformRequest{
				AuthContext:       &authpb.AuthContext{AccountId: 1},
				AndroidPlatformId: 1,
			},

			exp: &notificationpb.GetAndroidPlatformResponse{
				AndroidPlatform: &notificationpb.AndroidPlatform{
					Id:        1,
					AccountId: 1,
					Title:     "p1",

					PushCredentialsSenderId:  "sender_id",
					PushCredentialsServerKey: "server_key",
					PushCredentialsUpdatedAt: ts(t, ts2(t, "2017-05-04T16:26:25.445494Z")),

					CreatedAt: ts(t, ts2(t, "2017-05-04T16:26:26.445494Z")),
					UpdatedAt: ts(t, ts2(t, "2017-05-04T16:26:27.445494Z")),
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.desc, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.GetAndroidPlatform(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}
}

func test_Android_CreatePlatform(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = notification_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		AndroidPlatform *notificationpb.AndroidPlatform
		err             error
	}

	tests := []struct {
		desc string

		req *notificationpb.CreateAndroidPlatformRequest
		exp *notificationpb.CreateAndroidPlatformResponse

		expErr error

		after *expect
	}{
		{
			desc:   "error: validations",
			req:    &notificationpb.CreateAndroidPlatformRequest{},
			expErr: status.Errorf(codes.InvalidArgument, "validations: auth_ctx.account_id: is required. title: is required. push_credentials_server_key: is required. push_credentials_server_id: is required."),
		},

		{
			desc: "creates the Android_platform",
			req: &notificationpb.CreateAndroidPlatformRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				Title: "title",

				PushCredentialsSenderId:  "senderid",
				PushCredentialsServerKey: "serverkey",
			},

			exp: &notificationpb.CreateAndroidPlatformResponse{
				AndroidPlatform: &notificationpb.AndroidPlatform{
					Id:        1000,
					AccountId: 1,
					Title:     "title",

					PushCredentialsSenderId:  "senderid",
					PushCredentialsServerKey: "serverkey",
					PushCredentialsUpdatedAt: updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},

			after: &expect{
				AndroidPlatform: &notificationpb.AndroidPlatform{
					Id:        1000,
					AccountId: 1,
					Title:     "title",

					PushCredentialsSenderId:  "senderid",
					PushCredentialsServerKey: "serverkey",
					PushCredentialsUpdatedAt: updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.desc, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.CreateAndroidPlatform(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.AndroidPlatform, tt.after.err
					got, gotErr = androidPlatformById(db, got.AndroidPlatform.GetId())
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nAfter:Diff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func test_Android_UpdatePushCredentials(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = notification_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		AndroidPlatform *notificationpb.AndroidPlatform
		err             error
	}

	tests := []struct {
		desc string

		req *notificationpb.UpdateAndroidPlatformPushCredentialsRequest
		exp *notificationpb.UpdateAndroidPlatformPushCredentialsResponse

		expErr error

		after *expect
	}{

		{
			desc: "error: validations",
			req:  &notificationpb.UpdateAndroidPlatformPushCredentialsRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validations: auth_ctx.account_id: is required. push_credentials_server_key: is required. push_credentials_server_id: is required."),
		},

		{
			desc: "error: not found",
			req: &notificationpb.UpdateAndroidPlatformPushCredentialsRequest{
				AuthContext:              &authpb.AuthContext{AccountId: 1},
				AndroidPlatformId:        404,
				PushCredentialsSenderId:  "some",
				PushCredentialsServerKey: "some",
			},

			expErr: status.Errorf(codes.NotFound, "db.Update: Update: sql: no rows in result set"),
		},

		{
			desc: "updates the android_platform",
			req: &notificationpb.UpdateAndroidPlatformPushCredentialsRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				AndroidPlatformId: 1000,

				PushCredentialsSenderId:  "senderid",
				PushCredentialsServerKey: "serverkey",
			},

			exp: &notificationpb.UpdateAndroidPlatformPushCredentialsResponse{
				AndroidPlatform: &notificationpb.AndroidPlatform{
					Id:        1000,
					AccountId: 1,
					Title:     "title",

					PushCredentialsSenderId:  "senderid",
					PushCredentialsServerKey: "serverkey",
					PushCredentialsUpdatedAt: updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},

			after: &expect{
				AndroidPlatform: &notificationpb.AndroidPlatform{
					Id:        1000,
					AccountId: 1,

					Title: "title",

					PushCredentialsSenderId:  "senderid",
					PushCredentialsServerKey: "serverkey",
					PushCredentialsUpdatedAt: updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.desc, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.UpdateAndroidPlatformPushCredentials(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.AndroidPlatform, tt.after.err
					got, gotErr = androidPlatformById(db, got.AndroidPlatform.GetId())
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nDiff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func androidPlatformById(db *postgres.DB, id int32) (*notificationpb.AndroidPlatform, error) {
	p, err := db.AndroidPlatformStore().OneById(context.TODO(), id)
	if err != nil {
		return nil, err
	}

	proto, err := notification_grpc.AndroidPlatformToProto(p)
	if err != nil {
		return nil, err
	}

	return proto, nil
}
