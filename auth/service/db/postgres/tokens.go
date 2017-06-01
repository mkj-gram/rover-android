package postgres

import (
	"golang.org/x/net/context"

	"github.com/lib/pq"
	"github.com/pkg/errors"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
)

func (db *DB) CreateTokens(ctx context.Context, tokens ...*auth.Token) error {
	tx, err := db.db.Begin()
	if err != nil {
		return errors.Wrap(err, "db.Begin")
	}

	// TODO: should we handle possible rollback error?
	defer tx.Rollback() // noop after commit

	for _, tok := range tokens {
		_, err := db.CreateToken(ctx, tok)
		if err != nil {
			return errors.Wrap(err, "db.CreateToken")
		}
	}

	return tx.Commit()
}

func (db *DB) CreateToken(ctx context.Context, tok *auth.Token) (*auth.Token, error) {
	err := db.db.QueryRowContext(ctx, `
		INSERT INTO tokens (
			account_id, key,
			permission_scopes,
			created_at, updated_at
		) VALUES (
			$1, $2,
			$3,
			$4, $5
		)
		RETURNING key
	`,
		tok.GetAccountId(), tok.GetKey(),
		pq.Array(&tok.PermissionScopes),
		tok.GetCreatedAt(), tok.GetUpdatedAt(),
	).
		Scan(&tok.Key)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return tok, nil
}

func (db *DB) FindTokenByKey(ctx context.Context, key string) (*auth.Token, error) {
	var tok auth.Token

	err := db.db.QueryRowContext(ctx, `
		SELECT
			account_id, key,
			permission_scopes,
			created_at, updated_at
		FROM tokens
		WHERE key = $1
	`, key,
	).
		Scan(
			&tok.AccountId, &tok.Key,
			pq.Array(&tok.PermissionScopes),
			&tok.CreatedAt, &tok.UpdatedAt,
		)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return &tok, nil
}

func (db *DB) FindTokensByAccountId(ctx context.Context, account_id int) ([]*auth.Token, error) {
	rows, err := db.db.QueryContext(ctx, `
		SELECT
			account_id, key,
			permission_scopes,
			created_at, updated_at
		FROM tokens
		WHERE account_id = $1
	`, account_id,
	)

	if err != nil {
		return nil, errors.Wrap(err, "Query")
	}
	defer rows.Close()

	var tokens []*auth.Token

	for rows.Next() {
		tok := new(auth.Token)
		err := rows.Scan(
			&tok.AccountId, &tok.Key,
			pq.Array(&tok.PermissionScopes),
			&tok.CreatedAt, &tok.UpdatedAt,
		)
		if err != nil {
			return nil, errors.Wrap(err, "Scan")
		}
		tokens = append(tokens, tok)
	}

	return tokens, nil
}
