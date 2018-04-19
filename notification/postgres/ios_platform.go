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

const iosPlatformFields = `
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
`

type iosPlatformStore store

func (s *iosPlatformStore) Create(ctx context.Context, p *IosPlatform) error {
	query := `
		INSERT INTO ios_platforms(` + iosPlatformFields + `)
		VALUES( $1 ,$2 ,$3 ,$4 ,$5 ,$6 ,$7 ,$8 ,$9 ,$10)
		RETURNING id
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

func (s *iosPlatformStore) ListByAccountId(ctx context.Context, accountId int32) ([]*IosPlatform, error) {
	var (
		query = `
		SELECT id,` + iosPlatformFields + `
		FROM ios_platforms
			WHERE account_id = $1
			ORDER BY id desc
`

		ps []*IosPlatform
	)

	rows, err := s.db.QueryContext(ctx, query, accountId)
	if err != nil {
		return nil, errors.Wrap(err, "Query")
	}

	defer rows.Close()

	for rows.Next() {
		var p IosPlatform

		if err := s.scanPlatform(rows, &p); err != nil {
			return nil, errors.Wrap(err, "scanPlatform")
		}

		ps = append(ps, &p)
	}

	return ps, errors.Wrap(rows.Err(), "rows.Err")
}

func (s *iosPlatformStore) OneById(ctx context.Context, id int32) (*IosPlatform, error) {
	var (
		query = `
		SELECT id,` + iosPlatformFields + `
		FROM ios_platforms
			WHERE id = $1
`

		p IosPlatform
	)

	row := s.db.QueryRowContext(ctx, query, id)

	if err := s.scanPlatform(row, &p); err != nil {
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

		RETURNING id,` + iosPlatformFields

		p IosPlatform
	)

	row := s.db.
		QueryRowContext(ctx, query,
			update.Id,
			update.AccountId,

			update.BundleId,

			update.CertificateData,
			update.CertificatePassphrase,
			update.CertificateFilename,
			update.CertificateExpiresAt,
			update.CertificateUpdatedAt,

			update.UpdatedAt,
		)

	if err := s.scanPlatform(row, &p); err != nil {
		return nil, errors.Wrap(err, "Update")
	}

	return &p, nil
}

type rowScanner interface {
	Scan(dest ...interface{}) error
}

func (s *iosPlatformStore) scanPlatform(row rowScanner, p *IosPlatform) error {
	err := row.Scan(
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
	)

	return err
}
