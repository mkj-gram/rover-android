package grpc

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	notification "github.com/roverplatform/rover/apis/go/notification/v1"
	va "github.com/roverplatform/rover/go/validations"
	"github.com/roverplatform/rover/notification/postgres"
)

func (p *PlatformServer) CreateAndroidPlatform(ctx context.Context, req *notification.CreateAndroidPlatformRequest) (*notification.CreateAndroidPlatformResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_ctx.account_id", acctId, va.Require),
		va.Value("title", req.Title, va.Require),
		// va.Value("push_credentials_server_key", req.PushCredentialsServerKey, va.Require),
		// va.Value("push_credentials_server_id", req.PushCredentialsSenderId, va.Require),
	); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	var (
		now = postgres.TimeNow()

		platform = postgres.AndroidPlatform{
			// Id
			AccountId: acctId,
			Title:     req.Title,

			PushCredentialsSenderId:  req.PushCredentialsSenderId,
			PushCredentialsServerKey: req.PushCredentialsServerKey,
			PushCredentialsUpdatedAt: now,

			CreatedAt: now,
			UpdatedAt: now,
		}
	)

	if err := p.DB.AndroidPlatformStore().Create(ctx, &platform); err != nil {
		return nil, status.Errorf(ErrToStatus(err), "db.Create: %v", err)
	}

	proto, err := AndroidPlatformToProto(&platform)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "ToProto: %v", err)
	}

	return &notification.CreateAndroidPlatformResponse{
		AndroidPlatform: proto,
	}, nil
}

func (s *PlatformServer) GetAndroidPlatform(ctx context.Context, req *notification.GetAndroidPlatformRequest) (*notification.GetAndroidPlatformResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_ctx.account_id", acctId, va.Require),
		va.Value("android_platform_id", req.AndroidPlatformId, va.Require),
	); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	platform, err := s.DB.AndroidPlatformStore().OneById(ctx, req.AndroidPlatformId)
	if err != nil {
		return nil, status.Errorf(ErrToStatus(err), "Get: %v", err)
	}

	if platform.AccountId != req.GetAuthContext().GetAccountId() {
		return nil, status.Error(codes.NotFound, "not found")
	}

	proto, err := AndroidPlatformToProto(platform)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "ToProto: %v", err)
	}

	return &notification.GetAndroidPlatformResponse{
		AndroidPlatform: proto,
	}, nil
}

func (s *PlatformServer) UpdateAndroidPlatformPushCredentials(ctx context.Context, req *notification.UpdateAndroidPlatformPushCredentialsRequest) (*notification.UpdateAndroidPlatformPushCredentialsResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_ctx.account_id", acctId, va.Require),
		// va.Value("push_credentials_server_key", req.PushCredentialsServerKey, va.Require),
		// va.Value("push_credentials_server_id", req.PushCredentialsSenderId, va.Require),
	); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	var (
		now = postgres.TimeNow()

		update = postgres.AndroidPlatformUpdatePushCredentials{
			Id:        req.GetAndroidPlatformId(),
			AccountId: req.GetAuthContext().GetAccountId(),

			PushCredentialsSenderId:  req.PushCredentialsSenderId,
			PushCredentialsServerKey: req.PushCredentialsServerKey,
			PushCredentialsUpdatedAt: now,

			UpdatedAt: now,
		}
	)

	platform, err := s.DB.AndroidPlatformStore().UpdatePushCredentials(ctx, &update)
	if err != nil {
		return nil, status.Errorf(ErrToStatus(err), "db.Update: %v", err)
	}

	proto, err := AndroidPlatformToProto(platform)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "ToProto: %v", err)

	}

	return &notification.UpdateAndroidPlatformPushCredentialsResponse{
		AndroidPlatform: proto,
	}, nil
}
