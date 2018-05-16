package service

import (
	"regexp"
	"time"

	"golang.org/x/net/context"

	"github.com/pkg/errors"

	auth "github.com/roverplatform/rover/apis/go/auth/v1"
)

// Backend interface declares domain specific methods
type Backend interface {

	// Basic CRUD operations for Accounts
	GetAccount(context.Context, *auth.GetAccountRequest) (*auth.Account, error)
	CreateAccount(context.Context, *auth.Account) (*auth.Account, error)
	UpdateAccount(context.Context, *auth.Account) (*auth.Account, error)
	ListAccounts(context.Context) ([]*auth.Account, error)

	// Basic CRUD operations for Users
	CreateUser(context.Context, *User) (*User, error)
	UpdateUser(context.Context, *User) (*User, error)
	UpdateUserPassword(context.Context, *UserPasswordUpdate) error

	GetUserById(ctx context.Context, id int) (*User, error)
	FindUserByEmail(ctx context.Context, email string) (*User, error)

	// User sessions
	CreateUserSession(context.Context, *auth.UserSession) (*auth.UserSession, error)
	FindSessionByKey(ctx context.Context, key string) (*auth.UserSession, error)
	UpdateUserSession(ctx context.Context, sess *auth.UserSession) (*auth.UserSession, error)

	// AuthenticateUserSession(context.Context, *auth.AuthenticateRequest) (*auth.AuthContext, error)
	FindTokenByKey(ctx context.Context, tokenKey string) (*auth.Token, error)
	CreateTokens(context.Context, ...*auth.Token) error
	FindTokensByAccountId(ctx context.Context, accountID int) ([]*auth.Token, error)
}

// User wraps auth.User and adds required PasswordDigest field
type User struct {
	auth.User

	PasswordDigest []byte
}

// UserPasswordUpdate wraps auth.UserPasswordUpdate and adds required fields
type UserPasswordUpdate struct {
	*auth.UpdateUserPasswordRequest

	PasswordDigest []byte
	UpdatedAt      time.Time
}

var (
	// see https://golang.org/pkg/regexp/syntax/ for details
	// (?i) sets flags within current group
	emailRegexp = regexp.MustCompile(`(?i)\A[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+\z`)
)

func validateEmail(email string) error {
	if !emailRegexp.MatchString(email) {
		return errors.New("email: is invalid")
	}

	return nil
}

func validatePassword(plainPass string) error {
	if len(plainPass) < MinPassLen {
		return errors.New("password: is too short")
	}

	return nil
}
