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

func test_Ios_GetIosPlatform(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = notification_grpc.Server{PlatformServer: notification_grpc.PlatformServer{DB: db}}
	)

	defer closeDB()

	type expect struct {
		IosPlatform *postgres.IosPlatform
		err         error
	}

	tests := []struct {
		desc string

		req *notificationpb.GetIosPlatformRequest
		exp *notificationpb.GetIosPlatformResponse

		expErr error
	}{
		{
			desc: "error: validations",

			req: &notificationpb.GetIosPlatformRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validations: auth_ctx.account_id: is required. ios_platform_id: is required."),
		},

		{
			desc: "error: not found",
			req: &notificationpb.GetIosPlatformRequest{
				AuthContext:   &authpb.AuthContext{AccountId: 1},
				IosPlatformId: 404,
			},
			expErr: status.Errorf(codes.NotFound, "Get: Query: sql: no rows in result set"),
		},

		{
			desc: "error: account mismatch",
			req: &notificationpb.GetIosPlatformRequest{
				AuthContext:   &authpb.AuthContext{AccountId: 404},
				IosPlatformId: 1,
			},

			expErr: status.Errorf(codes.NotFound, "Get: not found"),
		},

		{
			desc: "gets the ios_platform",

			req: &notificationpb.GetIosPlatformRequest{
				AuthContext:   &authpb.AuthContext{AccountId: 1},
				IosPlatformId: 1,
			},

			exp: &notificationpb.GetIosPlatformResponse{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1,
					AccountId:             1,
					Title:                 "p1",
					BundleId:              "io.rover.bagel",
					CertificateData:       []byte("cert"),
					CertificateFilename:   "fname1",
					CertificatePassphrase: "pass1",
					CertificateExpiresAt:  ts(t, ts2(t, "2017-05-04T16:26:25.445494Z")),
					CertificateUpdatedAt:  ts(t, ts2(t, "2017-05-04T16:26:26.445494Z")),

					CreatedAt: ts(t, ts2(t, "2017-05-04T16:26:27.445494Z")),
					UpdatedAt: ts(t, ts2(t, "2017-05-04T16:26:28.445494Z")),
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
				got, gotErr = svc.GetIosPlatform(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}
}

func test_Ios_CreateIosPlatform(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = notification_grpc.Server{PlatformServer: notification_grpc.PlatformServer{DB: db}}
	)

	defer closeDB()

	type expect struct {
		IosPlatform *notificationpb.IosPlatform
		err         error
	}

	tests := []struct {
		desc string

		req *notificationpb.CreateIosPlatformRequest
		exp *notificationpb.CreateIosPlatformResponse

		expErr error

		after *expect
	}{
		{
			desc:   "error: validations",
			req:    &notificationpb.CreateIosPlatformRequest{},
			expErr: status.Errorf(codes.InvalidArgument, "validations: auth_ctx.account_id: is required. title: is required."),
		},

		{
			desc: "error: certificate validations",
			req: &notificationpb.CreateIosPlatformRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				Title:                 "title",
				CertificateData:       certP12(t, "testdata/invalid.p12"),
				CertificatePassphrase: "rover",
				CertificateFilename:   "fname",
			},

			expErr: status.Errorf(codes.InvalidArgument, "validations: cert: cert must be universal, cert must have UID subject, cert expired."),
		},

		{
			desc: "creates the ios_platform",
			req: &notificationpb.CreateIosPlatformRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				Title:                 "title",
				CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
				CertificatePassphrase: "",
				CertificateFilename:   "fname",
			},

			exp: &notificationpb.CreateIosPlatformResponse{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1000,
					AccountId:             1,
					Title:                 "title",
					BundleId:              "io.rover.Bagel",
					CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
					CertificateFilename:   "fname",
					CertificatePassphrase: "",
					CertificateExpiresAt:  ts(t, ts2(t, "2018-10-28T13:15:13-04:00")),
					CertificateUpdatedAt:  updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},

			after: &expect{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1000,
					AccountId:             1,
					BundleId:              "io.rover.Bagel",
					Title:                 "title",
					CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
					CertificateFilename:   "fname",
					CertificatePassphrase: "",
					CertificateExpiresAt:  ts(t, ts2(t, "2018-10-28T13:15:13-04:00")),
					CertificateUpdatedAt:  updatedAt,

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
				got, gotErr = svc.CreateIosPlatform(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.IosPlatform, tt.after.err
					got, gotErr = iosPlatformById(db, got.IosPlatform.GetId())
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nAfter:Diff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func test_Ios_UpdatePushCredentials(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = notification_grpc.Server{PlatformServer: notification_grpc.PlatformServer{DB: db}}
	)

	defer closeDB()

	type expect struct {
		IosPlatform *notificationpb.IosPlatform
		err         error
	}

	tests := []struct {
		desc string

		req *notificationpb.UpdateIosPlatformPushCertificateRequest
		exp *notificationpb.UpdateIosPlatformPushCertificateResponse

		expErr error

		after *expect
	}{
		{
			desc:   "error: validations",
			req:    &notificationpb.UpdateIosPlatformPushCertificateRequest{},
			expErr: status.Errorf(codes.InvalidArgument, "validations: auth_ctx.account_id: is required."),
		},

		{
			desc: "error: certificate validations",
			req: &notificationpb.UpdateIosPlatformPushCertificateRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				CertificateData:       certP12(t, "testdata/invalid.p12"),
				CertificatePassphrase: "rover",
				CertificateFilename:   "fname",
			},

			expErr: status.Errorf(codes.InvalidArgument, "validations: cert: cert must be universal, cert must have UID subject, cert expired."),
		},

		{
			desc: "error: account mismatch",
			req: &notificationpb.UpdateIosPlatformPushCertificateRequest{
				AuthContext:   &authpb.AuthContext{AccountId: 404},
				IosPlatformId: 1,

				CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
				CertificatePassphrase: "",
				CertificateFilename:   "cert2",
			},
			expErr: status.Errorf(codes.NotFound, "Update: Update: sql: no rows in result set"),
		},

		{
			desc: "error: not found",
			req: &notificationpb.UpdateIosPlatformPushCertificateRequest{
				AuthContext:   &authpb.AuthContext{AccountId: 1},
				IosPlatformId: 404,

				CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
				CertificatePassphrase: "",
				CertificateFilename:   "cert2",
			},
			expErr: status.Errorf(codes.NotFound, "Update: Update: sql: no rows in result set"),
		},

		{
			desc: "updated the ios_platform",
			req: &notificationpb.UpdateIosPlatformPushCertificateRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				IosPlatformId: 1000,

				CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
				CertificatePassphrase: "",
				CertificateFilename:   "cert2",
			},

			exp: &notificationpb.UpdateIosPlatformPushCertificateResponse{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1000,
					AccountId:             1,
					Title:                 "title",
					BundleId:              "io.rover.Bagel",
					CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
					CertificateFilename:   "cert2",
					CertificatePassphrase: "",
					CertificateExpiresAt:  ts(t, ts2(t, "2018-10-28T13:15:13-04:00")),
					CertificateUpdatedAt:  updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},

			after: &expect{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1000,
					AccountId:             1,
					BundleId:              "io.rover.Bagel",
					Title:                 "title",
					CertificateData:       certP12(t, "testdata/io.rover.Bagel.p12"),
					CertificateFilename:   "cert2",
					CertificatePassphrase: "",
					CertificateExpiresAt:  ts(t, ts2(t, "2018-10-28T13:15:13-04:00")),
					CertificateUpdatedAt:  updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},
		},

		{
			desc: "clear the ios_platform",
			req: &notificationpb.UpdateIosPlatformPushCertificateRequest{
				AuthContext: &authpb.AuthContext{AccountId: 1},

				IosPlatformId: 1000,

				CertificateData:       nil,
				CertificatePassphrase: "",
				CertificateFilename:   "",
			},

			exp: &notificationpb.UpdateIosPlatformPushCertificateResponse{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1000,
					AccountId:             1,
					Title:                 "title",
					BundleId:              "",
					CertificateData:       nil,
					CertificateFilename:   "",
					CertificatePassphrase: "",
					CertificateExpiresAt:  nil,
					CertificateUpdatedAt:  updatedAt,

					UpdatedAt: updatedAt,
					CreatedAt: updatedAt,
				},
			},

			after: &expect{
				IosPlatform: &notificationpb.IosPlatform{
					Id:                    1000,
					AccountId:             1,
					Title:                 "title",
					BundleId:              "",
					CertificateData:       nil,
					CertificateFilename:   "",
					CertificatePassphrase: "",
					CertificateExpiresAt:  nil,
					CertificateUpdatedAt:  updatedAt,

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
				got, gotErr = svc.UpdateIosPlatformPushCertificate(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.IosPlatform, tt.after.err
					got, gotErr = iosPlatformById(db, got.IosPlatform.GetId())
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nDiff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func iosPlatformById(db *postgres.DB, id int32) (*notificationpb.IosPlatform, error) {
	p, err := db.IosPlatformStore().OneById(context.TODO(), id)
	if err != nil {
		return nil, err
	}

	proto, err := notification_grpc.IosPlatformToProto(p)
	if err != nil {
		return nil, err
	}

	return proto, nil
}
