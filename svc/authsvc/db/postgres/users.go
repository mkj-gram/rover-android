package postgres

import (
	"golang.org/x/net/context"

	"github.com/lib/pq"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/svc/authsvc"
)

func (d *DB) GetUserById(ctx context.Context, id int) (*authsvc.User, error) {
	var usr authsvc.User

	err := d.db.QueryRowContext(ctx, `
		SELECT 
				id, account_id, name, email,
				password_digest, permission_scopes,
				created_at, updated_at
			FROM users
			WHERE id = $1
			LIMIT 1
		`, id,
	).Scan(
		&usr.Id, &usr.AccountId, &usr.Name, &usr.Email,
		&usr.PasswordDigest, pq.Array(&usr.PermissionScopes),
		&usr.CreatedAt, &usr.UpdatedAt,
	)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return &usr, nil
}

func (db *DB) FindUserByEmail(ctx context.Context, email string) (*authsvc.User, error) {
	var usr authsvc.User

	err := db.db.QueryRowContext(ctx, `
		SELECT
				id, account_id, name, email,
				password_digest, permission_scopes,
				created_at, updated_at
			FROM users
			WHERE email = $1
			LIMIT 1
		`, email,
	).
		Scan(
			&usr.Id, &usr.AccountId, &usr.Name, &usr.Email,
			&usr.PasswordDigest, pq.Array(&usr.PermissionScopes),
			&usr.CreatedAt, &usr.UpdatedAt,
		)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return &usr, nil
}

func (db *DB) CreateUser(ctx context.Context, usr *authsvc.User) (*authsvc.User, error) {
	err := db.db.QueryRowContext(ctx, `
		INSERT INTO users (
				account_id, name, email,
				password_digest, permission_scopes,
				created_at, updated_at
			) VALUES(
				$1, $2, $3,
				$4, $5,
				$6, $7
			)
			RETURNING id
	`,
		usr.GetAccountId(), usr.GetName(), usr.GetEmail(),
		usr.PasswordDigest, pq.Array(&usr.PermissionScopes),
		usr.CreatedAt, usr.UpdatedAt,
	).
		Scan(&usr.Id)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return usr, nil
}

func (db *DB) UpdateUser(ctx context.Context, usr *authsvc.User) (*authsvc.User, error) {
	err := db.db.QueryRowContext(ctx, `
		UPDATE users
			SET name = $3, email = $4, password_digest = $5, updated_at = $6
			WHERE id = $1 AND account_id = $2
			RETURNING id, permission_scopes, created_at
	`,
		usr.GetId(), usr.GetAccountId(),
		usr.GetName(), usr.GetEmail(), usr.PasswordDigest, usr.UpdatedAt,
	).
		Scan(&usr.Id, pq.Array(&usr.PermissionScopes), &usr.CreatedAt)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return usr, nil

}
