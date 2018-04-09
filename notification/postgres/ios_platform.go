package postgres

import (
	"context"
	"time"

	"github.com/pkg/errors"
)

type (
	IosPlatform struct {
		Id        int32
		AccountId int32
		Title     string
		BundleId  string

		CertificateData       string
		CertificatePassphrase string
		CertificateFilename   string
		CertificateExpiresAt  time.Time
		CertificateUpdatedAt  time.Time

		UpdatedAt time.Time
		CreatedAt time.Time
	}

	IosPlatformUpdatePushCredentials struct {
		Id        int32
		AccountId int32

		BundleId string

		CertificateData       string
		CertificatePassphrase string
		CertificateFilename   string
		CertificateExpiresAt  time.Time
		CertificateUpdatedAt  time.Time

		UpdatedAt time.Time
	}
)

type iosPlatformStore store

func (s *iosPlatformStore) Create(ctx context.Context, p *IosPlatform) error {
	query := `
		INSERT INTO ios_platforms(
			 account_id
			,title
			,bundle_id

			,certificate_data
			,certificate_passphrase
			,certificate_filename
			,certificate_expires_at
			,certificate_updated_at

			,updated_at
			,created_at
		) VALUES(
			 $1
			,$2
			,$3

			,$4
			,$5
			,$6
			,$7
			,$8

			,$9
			,$10
		) RETURNING id
`

	args := []interface{}{
		p.AccountId,
		p.Title,
		p.BundleId,

		p.CertificateData,
		p.CertificatePassphrase,
		p.CertificateFilename,
		p.CertificateExpiresAt,
		p.CertificateUpdatedAt,

		p.CreatedAt,
		p.UpdatedAt,
	}

	if err := s.db.
		QueryRowContext(ctx, query, args...).
		Scan(&p.Id); err != nil {
		return errors.Wrap(err, "Query")
	}

	return nil
}

func (s *iosPlatformStore) OneById(ctx context.Context, id int32) (*IosPlatform, error) {
	var (
		query = `
		SELECT
			id
			,account_id
			,title
			,bundle_id

			,certificate_data
			,certificate_passphrase
			,certificate_filename
			,certificate_expires_at
			,certificate_updated_at

			,updated_at
			,created_at

		FROM ios_platforms
			WHERE id = $1
`

		p IosPlatform
	)

	if err := s.db.
		QueryRowContext(ctx, query, id).
		Scan(
			&p.Id,
			&p.AccountId,
			&p.Title,
			&p.BundleId,

			&p.CertificateData,
			&p.CertificatePassphrase,
			&p.CertificateFilename,
			&p.CertificateExpiresAt,
			&p.CertificateUpdatedAt,

			&p.UpdatedAt,
			&p.CreatedAt,
		); err != nil {
		return nil, errors.Wrap(err, "Query")
	}

	return &p, nil
}

func (s *iosPlatformStore) UpdatePushCredentials(ctx context.Context, update IosPlatformUpdatePushCredentials) (*IosPlatform, error) {
	var (
		query = `
		UPDATE ios_platforms
		SET
			bundle_id = $3

			,certificate_data       = $4
			,certificate_passphrase = $5
			,certificate_filename   = $6
			,certificate_expires_at = $7
			,certificate_updated_at = $8

			,updated_at = $9

		WHERE
			id = $1 AND account_id = $2

		RETURNING
			 id
			,account_id
			,title
			,bundle_id

			,certificate_data
			,certificate_passphrase
			,certificate_filename
			,certificate_expires_at
			,certificate_updated_at

			,updated_at
			,created_at
`

		p IosPlatform
	)

	if err := s.db.
		QueryRow(query,
			update.Id,
			update.AccountId,

			update.BundleId,

			update.CertificateData,
			update.CertificatePassphrase,
			update.CertificateFilename,
			update.CertificateExpiresAt,
			update.CertificateUpdatedAt,

			update.UpdatedAt,
		).
		Scan(
			&p.Id,
			&p.AccountId,
			&p.Title,
			&p.BundleId,

			&p.CertificateData,
			&p.CertificatePassphrase,
			&p.CertificateFilename,
			&p.CertificateExpiresAt,
			&p.CertificateUpdatedAt,

			&p.UpdatedAt,
			&p.CreatedAt,
		); err != nil {
		return nil, errors.Wrap(err, "Update")
	}

	return &p, nil
}
