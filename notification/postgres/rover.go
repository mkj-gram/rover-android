package postgres

import (
	"encoding/base64"
	"time"

	"github.com/pkg/errors"
	"golang.org/x/crypto/pkcs12"
)

// RoverInboxIosPlatform is a known platform to support
// NOTE: must be set from an entry point
var RoverInboxIosPlatform *IosPlatform

func ParseIosPlatform(data, pass string) (*IosPlatform, error) {
	certData, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, errors.Wrap(err, "base64.DecodeString")
	}

	_ /*pkey*/, cert, err := pkcs12.Decode(certData, pass)
	if err != nil {
		return nil, errors.Wrap(err, "pkcs12.Decode")
	}

	now := time.Now()

	return &IosPlatform{
		Id:        0,
		AccountId: 0,
		Title:     "rover Inbox",

		BundleId:              "io.rover.Inbox",
		CertificateData:       data,
		CertificateExpiresAt:  cert.NotAfter,
		CertificatePassphrase: pass,
		CertificateUpdatedAt:  now,

		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}
