package postgres

import (
	"context"
	"time"

	"github.com/pkg/errors"
)

type (
	AndroidPlatform struct {
		Id        int32
		AccountId int32

		Title string

		PushCredentialsServerKey string
		PushCredentialsSenderId  string
		PushCredentialsUpdatedAt time.Time

		UpdatedAt time.Time
		CreatedAt time.Time
	}

	AndroidPlatformUpdatePushCredentials struct {
		Id        int32
		AccountId int32

		PushCredentialsServerKey string
		PushCredentialsSenderId  string
		PushCredentialsUpdatedAt time.Time

		UpdatedAt time.Time
	}
)

const androidPlatformFields = `
 account_id
,title

,push_credentials_server_key
,push_credentials_sender_id
,push_credentials_updated_at

,created_at
,updated_at
`

type androidPlatformStore store

func (s *androidPlatformStore) Create(ctx context.Context, p *AndroidPlatform) error {
	var (
		query = `
		INSERT
			INTO android_platforms(` + androidPlatformFields + `)
			VALUES ($1,$2,$3,$4,$5,$6,$7)
			RETURNING id
`
		args = []interface{}{
			p.AccountId,
			p.Title,

			p.PushCredentialsServerKey,
			p.PushCredentialsSenderId,
			p.PushCredentialsUpdatedAt,

			p.CreatedAt,
			p.UpdatedAt,
		}
	)

	if err := s.db.
		QueryRowContext(ctx, query, args...).
		Scan(&p.Id); err != nil {
		return errors.Wrap(err, "Query")
	}

	return nil
}

func (s *androidPlatformStore) ListByAccountId(ctx context.Context, accountId int32) ([]*AndroidPlatform, error) {
	var (
		query = `
		SELECT id,` + androidPlatformFields + `
		FROM android_platforms
			WHERE account_id = $1
			ORDER BY id desc
`

		ps []*AndroidPlatform
	)

	rows, err := s.db.QueryContext(ctx, query, accountId)
	if err != nil {
		return nil, errors.Wrap(err, "Query")
	}

	defer rows.Close()

	for rows.Next() {
		var p AndroidPlatform

		if err := s.scanPlatform(rows, &p); err != nil {
			return nil, errors.Wrap(err, "scanPlatform")
		}

		ps = append(ps, &p)
	}

	return ps, errors.Wrap(rows.Err(), "rows.Err")
}

func (s *androidPlatformStore) OneById(ctx context.Context, id int32) (*AndroidPlatform, error) {
	var (
		query = `
		SELECT id,` + androidPlatformFields + `
		FROM android_platforms
		WHERE id = $1
		LIMIT 1
`

		p AndroidPlatform
	)

	var row = s.db.QueryRowContext(ctx, query, id)
	if err := s.scanPlatform(row, &p); err != nil {
		return nil, errors.Wrap(err, "Query")
	}

	return &p, nil
}

func (s *androidPlatformStore) UpdatePushCredentials(ctx context.Context, upd *AndroidPlatformUpdatePushCredentials) (*AndroidPlatform, error) {
	var (
		query = `
		UPDATE android_platforms
		SET
			 push_credentials_server_key = $3
			,push_credentials_sender_id = $4
			,push_credentials_updated_at = $5

			,updated_at = $6
		WHERE
			id = $1 AND account_id = $2
		RETURNING id,` + androidPlatformFields

		args = []interface{}{
			upd.Id,
			upd.AccountId,

			upd.PushCredentialsServerKey,
			upd.PushCredentialsSenderId,
			upd.PushCredentialsUpdatedAt,

			upd.UpdatedAt,
		}

		p AndroidPlatform
	)

	var row = s.db.QueryRowContext(ctx, query, args...)
	if err := s.scanPlatform(row, &p); err != nil {
		return nil, errors.Wrap(err, "Update")
	}

	return &p, nil
}

func (s *androidPlatformStore) scanPlatform(row rowScanner, p *AndroidPlatform) error {
	err := row.Scan(
		&p.Id,
		&p.AccountId,
		&p.Title,

		&p.PushCredentialsServerKey,
		&p.PushCredentialsSenderId,
		&p.PushCredentialsUpdatedAt,

		&p.CreatedAt,
		&p.UpdatedAt,
	)

	return err
}
