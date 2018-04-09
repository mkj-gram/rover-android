package grpc

import (
	"encoding/base64"
	"time"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	db "github.com/roverplatform/rover/notification/postgres"
)

func timeToProto(t time.Time) *timestamp.Timestamp {
	ts, err := timestamp.TimestampProto(t)
	if err != nil {
		panic(errors.Wrap(err, "timestamp.ToProto"))
	}

	return ts
}

func IosPlatformToProto(p *db.IosPlatform) (*notification.IosPlatform, error) {
	certData, err := base64.StdEncoding.DecodeString(p.CertificateData)
	if err != nil {
		return nil, errors.Wrap(err, "base64.DecodeString")
	}

	proto := &notification.IosPlatform{
		Id:        p.Id,
		AccountId: p.AccountId,
		Title:     p.Title,
		BundleId:  p.BundleId,

		CertificateData:       certData,
		CertificatePassphrase: p.CertificatePassphrase,
		CertificateFilename:   p.CertificateFilename,
		CertificateUpdatedAt:  timeToProto(p.CertificateUpdatedAt),
		CertificateExpiresAt:  timeToProto(p.CertificateExpiresAt),

		UpdatedAt: timeToProto(p.UpdatedAt),
		CreatedAt: timeToProto(p.CreatedAt),
	}

	return proto, nil
}

func AndroidPlatformToProto(p *db.AndroidPlatform) (*notification.AndroidPlatform, error) {
	proto := &notification.AndroidPlatform{
		Id:        p.Id,
		AccountId: p.AccountId,
		Title:     p.Title,

		PushCredentialsSenderId:  p.PushCredentialsSenderId,
		PushCredentialsServerKey: p.PushCredentialsServerKey,
		PushCredentialsUpdatedAt: timeToProto(p.PushCredentialsUpdatedAt),

		CreatedAt: timeToProto(p.CreatedAt),
		UpdatedAt: timeToProto(p.UpdatedAt),
	}

	return proto, nil
}
