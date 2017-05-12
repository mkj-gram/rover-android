package authsvc

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/grpclog"

	"github.com/pkg/errors"

	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

const (
	// KeyLength is a default byte length for session and token keys
	KeyLength = 20

	// SessionDuration sets the session duration
	SessionDuration = time.Hour * 24

	// MinPassLen sets the minimum password length
	MinPassLen = 6
)

var (
	// Register is a convenience wrapper for auth.RegisterAuthServer
	Register = auth.RegisterAuthServer

	// TimeNow provides current time
	// tests override this
	TimeNow = time.Now

	// EncodeToString converts binary slice to a human readable string
	// and is used to generate session/token keys
	EncodeToString = hex.EncodeToString

	// RandRead reads random bytes into the byte slice
	// NOTE: ensure production version uses crypto/rand
	RandRead = rand.Read

	// GenerateFromPassword generates a password hash
	GenerateFromPassword = func(pass []byte) ([]byte, error) {
		return bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
	}
)

// SecretKey provides token/session key value.
// It uses RandRead to obtain KeyLength bytes for secret
func SecretKey() ([]byte, error) {
	var key [KeyLength]byte

	_, err := RandRead(key[:])
	if err != nil {
		return nil, errors.Wrap(err, "RandRead")
	}

	return key[:], nil
}

// ensure Server implements the interface
var _ auth.AuthServer = (*Server)(nil)

// Server implements auth.AuthServer
type Server struct{ DB Backend }

// CreateAccount implements auth.AuthServer.CreateAccount
func (svr *Server) CreateAccount(ctx context.Context, r *auth.CreateAccountRequest) (*auth.Account, error) {
	var (
		now   = TimeNow()
		ts, _ = timestamp.TimestampProto(now)

		acct = &auth.Account{
			Name:      r.GetName(),
			CreatedAt: ts,
			UpdatedAt: ts,
		}
	)

	acct, err := svr.DB.CreateAccount(ctx, acct)
	if err != nil {
		return nil, grpc.Errorf(codes.Unknown, "db.CreateAccount: %s", err)
	}

	var tokensScopes = []string{"web", "sdk", "server"}
	var defaultTokens = make([]*auth.Token, len(tokensScopes))

	// NOTE: failure to create a token doesn't result in an error returned to a caller
	// so client doesn't retry creating same account again
	for i, scope := range tokensScopes {
		key, err := SecretKey()
		if err != nil {
			grpclog.Printf("DefaultTokens:SecretKey: account_id=%d: %v", acct.GetId(), err)
			return acct, nil
		}

		defaultTokens[i] = &auth.Token{
			AccountId:        acct.GetId(),
			PermissionScopes: []string{scope},
			Key:              EncodeToString(key),

			CreatedAt: ts, UpdatedAt: ts,
		}
	}

	if err := svr.DB.CreateTokens(ctx, defaultTokens...); err != nil {
		grpclog.Printf("DefaultTokens:db.CreateTokens: account_id=%d: %v", acct.GetId(), err)
		return acct, nil
	}

	return acct, nil
}

// GetAccount implements auth.AuthServer
func (svr *Server) GetAccount(ctx context.Context, r *auth.GetAccountRequest) (*auth.Account, error) {

	acct, err := svr.DB.GetAccount(ctx, r)

	if errors.Cause(err) == sql.ErrNoRows {
		return nil, grpc.Errorf(codes.NotFound, "db.GetAccount: account_id=%d", r.GetAccountId())
	}

	return acct, err
}

// UpdateAccount implements auth.AuthServer
func (svr *Server) UpdateAccount(ctx context.Context, r *auth.UpdateAccountRequest) (*auth.Account, error) {
	//TODO: validate name: can't be blank
	var (
		now   = TimeNow()
		ts, _ = timestamp.TimestampProto(now)

		acct = &auth.Account{
			Id:        r.GetAccountId(),
			Name:      r.GetName(),
			UpdatedAt: ts,
		}
	)

	acct, err := svr.DB.UpdateAccount(ctx, acct)

	if errors.Cause(err) == sql.ErrNoRows {
		return nil, grpc.Errorf(codes.NotFound, "db.UpdateAccount: account_id=%d", r.GetAccountId())
	}

	return acct, err
}

// GetUser implements auth.AuthServer
func (svr *Server) GetUser(ctx context.Context, r *auth.GetUserRequest) (*auth.User, error) {
	usr, err := svr.DB.GetUserById(ctx, int(r.GetUserId()))
	if errors.Cause(err) == sql.ErrNoRows {
		return nil, grpc.Errorf(codes.NotFound, "db.GetUserById: user_id=%d account_id=%d", r.GetUserId(), r.GetAccountId())
	}

	if err != nil {
		return nil, grpc.Errorf(codes.Unknown, "db.GetUserById: user_id=%d account_id=%d: %s", r.GetUserId(), r.GetAccountId(), err)
	}

	if usr.AccountId != r.GetAccountId() {
		return nil, grpc.Errorf(codes.NotFound, "AccountId: user_id=%d account_id=%d: mismatch", r.GetUserId(), r.GetAccountId())
	}

	return &usr.User, nil
}

// CreateUser implements auth.AuthServer
func (svr *Server) CreateUser(ctx context.Context, r *auth.CreateUserRequest) (*auth.User, error) {
	if err := validatePassword(r.GetPassword()); err != nil {
		return nil, grpc.Errorf(codes.InvalidArgument, `validate: account_id=%d: %v`, r.GetAccountId(), err)
	}

	if err := validateEmail(r.GetEmail()); err != nil {
		return nil, grpc.Errorf(codes.InvalidArgument, `validate: account_id=%d: %v`, r.GetAccountId(), err)
	}

	passwordDigest, err := GenerateFromPassword([]byte(r.GetPassword()))
	if err != nil {
		return nil, grpc.Errorf(codes.Internal, `generate_digest: %s`, err)
	}

	var (
		now   = TimeNow()
		ts, _ = timestamp.TimestampProto(now)

		usr = &User{
			User: auth.User{
				AccountId: r.GetAccountId(),
				Email:     strings.ToLower(r.GetEmail()),
				Name:      r.GetName(),
				// NOTE: 2017-05-09: hardcoded "admin" scope
				// TODO: this will eventually become part of the auth.CreateUserRequest
				PermissionScopes: []string{"admin"},
				CreatedAt:        ts,
				UpdatedAt:        ts,
			},
			PasswordDigest: passwordDigest,
		}
	)

	usr, err = svr.DB.CreateUser(ctx, usr)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, grpc.Errorf(codes.NotFound, "db.CreateUser: account_id=%d:", r.GetAccountId())
		}

		return nil, grpc.Errorf(codes.Unknown, "db.CreateUser: account_id=%d: %s", r.GetAccountId(), err)
	}

	return &usr.User, nil
}

// UpdateUser implements auth.AuthServer
func (svr *Server) UpdateUser(ctx context.Context, r *auth.UpdateUserRequest) (*auth.User, error) {
	if err := validatePassword(r.GetPassword()); err != nil {
		return nil, grpc.Errorf(codes.InvalidArgument, `validate: user_id=%d: %v`, r.GetUserId(), err)
	}

	if err := validateEmail(r.GetEmail()); err != nil {
		return nil, grpc.Errorf(codes.InvalidArgument, `validate: user_id=%d: %v`, r.GetUserId(), err)
	}

	passwordDigest, err := GenerateFromPassword([]byte(r.GetPassword()))
	if err != nil {
		return nil, grpc.Errorf(codes.Unknown, `generate_digest: %s`, err)
	}

	var (
		now   = TimeNow()
		ts, _ = timestamp.TimestampProto(now)

		usr = &User{
			User: auth.User{
				Id:        r.GetUserId(),
				AccountId: r.GetAccountId(),
				Email:     strings.ToLower(r.GetEmail()),
				Name:      r.GetName(),
				// NOTE: 2017-05-09: hardcoded "admin" scope
				// TODO: this will eventually become part of the auth.UpdateUserRequest
				PermissionScopes: []string{"admin"},
				UpdatedAt:        ts,
			},
			PasswordDigest: passwordDigest,
		}
	)

	usr, err = svr.DB.UpdateUser(ctx, usr)

	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, grpc.Errorf(codes.NotFound, "db.UpdateUser: account_id=%d user_id=%d", r.GetAccountId(), r.GetUserId())
		}

		return nil, grpc.Errorf(codes.Unknown, "db.UpdateUser: account_id=%d user_id=%d: %s", r.GetAccountId(), r.GetUserId(), err)
	}

	return &usr.User, err
}

// CreateUserSession implements auth.AuthServer
func (svr *Server) CreateUserSession(ctx context.Context, r *auth.CreateUserSessionRequest) (*auth.UserSession, error) {
	if r == nil {
		return nil, grpc.Errorf(codes.InvalidArgument, `validation: user_session: nil request`)
	}

	usr, err := svr.DB.FindUserByEmail(ctx, strings.ToLower(r.GetEmail()))
	if err != nil {
		return nil, grpc.Errorf(codes.NotFound, "db.FindUserByEmail")
	}

	if err := bcrypt.CompareHashAndPassword(usr.PasswordDigest, []byte(r.Password)); err != nil {
		return nil, grpc.Errorf(codes.Unauthenticated, `CompareHashAndPassword: user_id=%d: %s`, usr.Id, err)
	}

	key, err := SecretKey()
	if err != nil {
		return nil, grpc.Errorf(codes.Internal, `SecretKey: %s`, err)
	}

	var (
		now = TimeNow()

		ts, _        = timestamp.TimestampProto(now)
		expiresTs, _ = timestamp.TimestampProto(now.Add(SessionDuration))

		sess = &auth.UserSession{
			UserId:      usr.GetId(),
			Key:         EncodeToString(key),
			CreatedAt:   ts,
			UpdatedAt:   ts,
			ExpiresAt:   expiresTs,
			LastSeen_IP: r.LastSeen_IP,
		}
	)

	sess, err = svr.DB.CreateUserSession(ctx, sess)
	if err != nil {
		return nil, grpc.Errorf(codes.Unknown, `db.CreateUserSession: user_id=%d: %s`, usr.Id, err)
	}

	return sess, nil
}

// AuthenticateUserSession implements auth.AuthServer
func (svr *Server) AuthenticateUserSession(ctx context.Context, r *auth.AuthenticateRequest) (*auth.AuthContext, error) {
	sess, err := svr.DB.FindSessionByKey(ctx, r.Key)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, grpc.Errorf(codes.NotFound, "db.FindSessionByKey")
		}

		return nil, grpc.Errorf(codes.Unknown, "db.FindSessionByKey: %s", err)
	}

	expiresAt, err := timestamp.Time(sess.ExpiresAt)
	if err != nil {
		return nil, grpc.Errorf(codes.Internal, "UserSession.ExpiresAt: user_id=%d: %s", err)
	}

	var now = TimeNow()

	if expiresAt.Before(now) {
		return nil, grpc.Errorf(codes.NotFound, "UserSession: user_id=%d: expired", sess.UserId)
	}

	usr, err := svr.DB.GetUserById(ctx, int(sess.UserId))
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, grpc.Errorf(codes.NotFound, "db.GetUserById user_id=%d", sess.UserId)
		}

		return nil, grpc.Errorf(codes.Unknown, "db.FindSessionByKey: user_id=%d: %s", usr.Id, err)
	}

	// shouldn't fail as now is a valid time
	sess.UpdatedAt, _ = timestamp.TimestampProto(now)
	sess.ExpiresAt, _ = timestamp.TimestampProto(now.Add(SessionDuration))
	sess.LastSeen_IP = r.GetLastSeen_IP()

	if _, err = svr.DB.UpdateUserSession(ctx, sess); err != nil {
		return nil, grpc.Errorf(codes.Unknown, "db.UpdateUserSession: user_id=%d: %s", usr.Id, err)
	}

	return &auth.AuthContext{
		AccountId:        usr.AccountId,
		UserId:           usr.Id,
		PermissionScopes: usr.PermissionScopes,
	}, nil
}

// AuthenticateToken implements auth.AuthenticateToken
func (svr *Server) AuthenticateToken(ctx context.Context, r *auth.AuthenticateRequest) (*auth.AuthContext, error) {
	tok, err := svr.DB.FindTokenByKey(ctx, r.Key)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, grpc.Errorf(codes.NotFound, "db.FindTokenByKey: %s", r.Key)
		}

		return nil, grpc.Errorf(codes.Unknown, "db.FindTokenByKey: %s", err)
	}

	return &auth.AuthContext{
		AccountId:        tok.AccountId,
		UserId:           0,
		PermissionScopes: tok.PermissionScopes,
	}, nil
}
