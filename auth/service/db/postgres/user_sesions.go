package postgres

import (
	"golang.org/x/net/context"

	"github.com/pkg/errors"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
)

func (db *DB) CreateUserSession(ctx context.Context, sess *auth.UserSession) (*auth.UserSession, error) {
	err := db.db.QueryRowContext(ctx, `
		INSERT INTO user_sessions (
			user_id, key,
			expires_at, last_seen_IP,
			created_at, updated_at
		) VALUES (
			$1, $2,
			$3, $4,
			$5, $6
		)
		RETURNING key
	`,
		sess.UserId, sess.Key,
		sess.ExpiresAt, sess.LastSeen_IP,
		sess.CreatedAt, sess.UpdatedAt,
	).
		Scan(&sess.Key)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return sess, nil
}

func (db *DB) FindSessionByKey(ctx context.Context, key string) (*auth.UserSession, error) {
	var sess auth.UserSession
	err := db.db.QueryRowContext(ctx, `
		SELECT
			user_id, key,
			expires_at, last_seen_IP,
			created_at, updated_at

		FROM user_sessions
		WHERE key = $1
	`,
		key,
	).Scan(
		&sess.UserId, &sess.Key,
		&sess.ExpiresAt, &sess.LastSeen_IP,
		&sess.CreatedAt, &sess.UpdatedAt,
	)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return &sess, nil
}

func (db *DB) UpdateUserSession(ctx context.Context, sess *auth.UserSession) (*auth.UserSession, error) {
	err := db.db.QueryRowContext(ctx, `
		UPDATE user_sessions
		SET expires_at = $2, updated_at = $3, last_seen_ip = $4
		WHERE key = $1
		RETURNING key
	`,
		sess.GetKey(),
		sess.GetExpiresAt(), sess.GetUpdatedAt(), sess.GetLastSeen_IP(),
	).Scan(
		&sess.Key,
	)

	if err != nil {
		return nil, errors.Wrap(err, "Scan")
	}

	return sess, nil
}
