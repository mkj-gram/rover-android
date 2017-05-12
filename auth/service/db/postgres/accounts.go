package postgres

import (
	"golang.org/x/net/context"

	"github.com/pkg/errors"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
)

func (d *DB) GetAccount(ctx context.Context, r *auth.GetAccountRequest) (*auth.Account, error) {
	var acct = new(auth.Account)
	err := d.db.QueryRowContext(ctx, `
		SELECT
			id, name, created_at, updated_at
			FROM accounts
			WHERE id = $1
			LIMIT 1
		`, r.GetAccountId(),
	).Scan(&acct.Id, &acct.Name, &acct.CreatedAt, &acct.UpdatedAt)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return acct, nil
}

func (d *DB) CreateAccount(ctx context.Context, acct *auth.Account) (*auth.Account, error) {
	err := d.db.QueryRowContext(ctx, `
		INSERT INTO accounts
			(name, created_at, updated_at)
			VALUES($1, $2, $3)
			RETURNING id
	`, acct.GetName(), acct.GetCreatedAt(), acct.GetUpdatedAt(),
	).Scan(&acct.Id)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return acct, nil
}

func (d *DB) UpdateAccount(ctx context.Context, acct *auth.Account) (*auth.Account, error) {
	err := d.db.QueryRowContext(ctx, `
		UPDATE accounts
			SET name = $2, updated_at = $3
			WHERE id = $1
			RETURNING id, created_at
	`, acct.GetId(), acct.GetName(), acct.GetUpdatedAt(),
	).Scan(&acct.Id, &acct.CreatedAt)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return acct, nil
}
