package postgres

import (
	"golang.org/x/net/context"

	"github.com/lib/pq"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/auth/service"
)

func (d *DB) GetUserById(ctx context.Context, id int) (*service.User, error) {
	var usr service.User

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

func (db *DB) FindUserByEmail(ctx context.Context, email string) (*service.User, error) {
	var usr service.User

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

func (db *DB) CreateUser(ctx context.Context, usr *service.User) (*service.User, error) {
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

func (db *DB) UpdateUser(ctx context.Context, usr *service.User) (*service.User, error) {
	err := db.db.QueryRowContext(ctx, `
		UPDATE users
			SET name = $3, email = $4, updated_at = $5
			WHERE id = $1 AND account_id = $2
			RETURNING id, permission_scopes, created_at
	`,
		usr.GetId(), usr.GetAccountId(),
		usr.GetName(), usr.GetEmail(), usr.UpdatedAt,
	).
		Scan(&usr.Id, pq.Array(&usr.PermissionScopes), &usr.CreatedAt)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return usr, nil
}

func (db *DB) UpdateUserPassword(ctx context.Context, up *service.UserPasswordUpdate) error {
	err := db.db.QueryRowContext(ctx, `
		UPDATE users
			SET password_digest = $3, updated_at = $4
			WHERE id = $1 AND account_id = $2
			RETURNING id
	`,
		up.GetUserId(), up.GetAccountId(),
		up.PasswordDigest, up.UpdatedAt,
	).
		Scan(&up.UserId)

	if err != nil {
		return errors.Wrap(err, "Scan")
	}

	return nil
}

func (d *DB) ListUsers(ctx context.Context, account_id int) ([]*service.User, error) {

	rows, err := d.db.QueryContext(ctx, `
		SELECT
			id, account_id, name, email,
			password_digest, permission_scopes,
			created_at, updated_at
			FROM users
			WHERE account_id = $1
			ORDER BY id DESC`, account_id)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}
	defer rows.Close()

	var users []*service.User

	for rows.Next() {
		var user service.User

		err := rows.Scan(
			&user.Id,
			&user.AccountId,
			&user.Name,
			&user.Email,
			&user.PasswordDigest,
			pq.Array(&user.PermissionScopes),
			&user.CreatedAt,
			&user.UpdatedAt)

		if err != nil {
			return nil, errors.Wrap(err, "Scan")
		}

		users = append(users, &user)
	}

	return users, nil
}
