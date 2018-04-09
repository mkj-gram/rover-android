package grpc

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	notification "github.com/roverplatform/rover/apis/go/notification/v1"
	va "github.com/roverplatform/rover/go/validations"
	"github.com/roverplatform/rover/notification/postgres"
)

func validateCertIsUniversal(val interface{}) error {
	cert, ok := val.(*Certificate)
	if !ok {
		return va.ErrUnknown
	}
	if !certIsUniversal(cert.cert) {
		return ErrCertNonUniversal
	}
	return nil
}

func validateCertHasBundleId(val interface{}) error {
	cert, ok := val.(*Certificate)
	if !ok {
		return va.ErrUnknown
	}
	if _, ok := certHasBundleId(cert.cert); !ok {
		return ErrCertMissingUIDSubject
	}
	return nil
}

func validateCertIsNotExpired(val interface{}) error {
	cert, ok := val.(*Certificate)
	if !ok {
		return va.ErrUnknown
	}

	if now := postgres.TimeNow(); cert.ExpiresAt.Before(now) {
		return ErrCertExpired
	}

	return nil
}

func (s *Server) CreateIosPlatform(ctx context.Context, req *notification.CreateIosPlatformRequest) (*notification.CreateIosPlatformResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_ctx.account_id", acctId, va.Require),
		va.Value("certificate_data", req.CertificateData, va.Require),
		va.Value("certificate_filename", req.CertificateFilename, va.Require),
		va.Value("title", req.Title, va.Require),
	); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	cert, err := decode(req.GetCertificateData(), req.GetCertificatePassphrase())
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Decode: %v", err)
	}

	if err := va.All(
		va.Value("cert", cert,
			validateCertIsUniversal,
			validateCertHasBundleId,
			validateCertIsNotExpired,
		)); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	var (
		now = postgres.TimeNow()

		platform = postgres.IosPlatform{
			AccountId: req.AuthContext.AccountId,
			Title:     req.Title,
			BundleId:  cert.BundleId,

			CertificateData:       cert.EncodedData(),
			CertificatePassphrase: req.CertificatePassphrase,
			CertificateFilename:   req.CertificateFilename,
			CertificateExpiresAt:  cert.ExpiresAt,
			CertificateUpdatedAt:  now,

			UpdatedAt: now,
			CreatedAt: now,
		}
	)

	if err := s.DB.IosPlatformStore().Create(ctx, &platform); err != nil {
		return nil, status.Errorf(ErrToStatus(err), "db.Create: %v", err)
	}

	proto, err := IosPlatformToProto(&platform)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "toProto: %v", err)
	}

	return &notification.CreateIosPlatformResponse{
		IosPlatform: proto,
	}, nil
}

func (s *Server) GetIosPlatform(ctx context.Context, req *notification.GetIosPlatformRequest) (*notification.GetIosPlatformResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_ctx.account_id", acctId, va.Require),
		va.Value("ios_platform_id", req.IosPlatformId, va.Require),
	); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	platform, err := s.DB.IosPlatformStore().OneById(ctx, req.GetIosPlatformId())
	if err != nil {
		return nil, status.Errorf(ErrToStatus(err), "Get: %v", err)
	}

	if platform.AccountId != req.AuthContext.AccountId {
		return nil, status.Errorf(codes.NotFound, "Get: not found")
	}

	platformProto, err := IosPlatformToProto(platform)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "toProto: %v", err)
	}

	return &notification.GetIosPlatformResponse{
		IosPlatform: platformProto,
	}, nil
}

func (s *Server) UpdateIosPlatformPushCertificate(ctx context.Context, req *notification.UpdateIosPlatformPushCertificateRequest) (*notification.UpdateIosPlatformPushCertificateResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_ctx.account_id", acctId, va.Require),
		va.Value("certificate_data", req.CertificateData, va.Require),
		va.Value("certificate_filename", req.CertificateFilename, va.Require),
	); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	cert, err := decode(req.GetCertificateData(), req.GetCertificatePassphrase())
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Decode: %v", err)
	}

	if err := va.All(
		va.Value("cert", cert,
			validateCertIsUniversal,
			validateCertHasBundleId,
			validateCertIsNotExpired,
		)); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "validations: %v", err)
	}

	var (
		now = postgres.TimeNow()

		update = postgres.IosPlatformUpdatePushCredentials{
			Id:        req.IosPlatformId,
			AccountId: req.GetAuthContext().GetAccountId(),
			BundleId:  cert.BundleId,

			CertificateData:       cert.EncodedData(),
			CertificatePassphrase: req.CertificatePassphrase,
			CertificateFilename:   req.CertificateFilename,
			CertificateExpiresAt:  cert.ExpiresAt,
			CertificateUpdatedAt:  now,

			UpdatedAt: now,
		}
	)

	platform, err := s.DB.IosPlatformStore().UpdatePushCredentials(ctx, update)
	if err != nil {
		return nil, status.Errorf(ErrToStatus(err), "Update: %v", err)
	}

	proto, err := IosPlatformToProto(platform)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "toProto: %v", err)
	}

	return &notification.UpdateIosPlatformPushCertificateResponse{
		IosPlatform: proto,
	}, nil
}
