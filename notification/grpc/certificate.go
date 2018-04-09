package grpc

import (
	"crypto/x509"
	"encoding/base64"
	"time"

	"github.com/pkg/errors"

	"golang.org/x/crypto/pkcs12"
)

const (
	x509UniversalCertId = "1.2.840.113635.100.6.3.6"
	x509UserID          = "0.9.2342.19200300.100.1.1"
)

var (
	ErrCertNonUniversal      = errors.New("cert must be universal")
	ErrCertMissingUIDSubject = errors.New("cert must have UID subject")
	ErrCertExpired           = errors.New("cert expired")
)

type Certificate struct {
	cert      *x509.Certificate
	BundleId  string
	Data      []byte
	ExpiresAt time.Time
}

func decode(data []byte, passphrase string) (*Certificate, error) {
	_ /*pkey*/, cert, err := pkcs12.Decode(data, passphrase)
	if err != nil {
		return nil, errors.Wrap(err, "pkcs12.Decode")
	}

	var bundleId string
	if id, ok := certHasBundleId(cert); ok {
		bundleId = id
	}

	return &Certificate{
		cert:      cert,
		BundleId:  bundleId,
		Data:      data,
		ExpiresAt: cert.NotAfter,
	}, nil
}

func certIsUniversal(cert *x509.Certificate) bool {
	for _, ext := range cert.Extensions {
		if ext.Id.String() == x509UniversalCertId {
			return true
		}
	}
	return false
}

func certHasBundleId(cert *x509.Certificate) (string, bool) {
	for _, name := range cert.Subject.Names {
		if name.Type.String() != x509UserID {
			continue
		}
		if bundleId, ok := name.Value.(string); ok {
			return bundleId, ok
		}
	}

	return "", false
}

func (c *Certificate) EncodedData() string {
	return base64.StdEncoding.EncodeToString(c.Data)
}
