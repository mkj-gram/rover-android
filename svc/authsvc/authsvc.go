package authsvc

import (
	"golang.org/x/net/context"

	auth "github.com/roverplatform/rover/go/apis/auth/v1"
)

var Register = auth.RegisterAuthServer

type Server struct{}

var _ auth.AuthServer = (*Server)(nil)

func (s *Server) GetAccount(context.Context, *auth.GetAccountRequest) (*auth.GetAccountReply, error) {
	return new(auth.GetAccountReply), nil
}

func (s *Server) CreateAccount(context.Context, *auth.CreateAccountRequest) (*auth.CreateAccountReply, error) {
	return new(auth.CreateAccountReply), nil
}

func (s *Server) UpdateAccount(context.Context, *auth.UpdateAccountRequest) (*auth.UpdateAccountReply, error) {
	return new(auth.UpdateAccountReply), nil
}

func (s *Server) GetUser(context.Context, *auth.GetUserRequest) (*auth.GetUserReply, error) {
	return new(auth.GetUserReply), nil
}

func (s *Server) CreateUser(context.Context, *auth.CreateUserRequest) (*auth.CreateUserReply, error) {
	return new(auth.CreateUserReply), nil
}

func (s *Server) UpdateUser(context.Context, *auth.UpdateUserRequest) (*auth.UpdateUserReply, error) {
	return new(auth.UpdateUserReply), nil
}

func (s *Server) CreateUserSession(context.Context, *auth.CreateUserSessionRequest) (*auth.CreateUserSessionReply, error) {
	return new(auth.CreateUserSessionReply), nil
}

func (s *Server) Authenticate(context.Context, *auth.AuthenticateRequest) (*auth.AuthenticateReply, error) {
	return new(auth.AuthenticateReply), nil
}

func (s *Server) HasAccess(context.Context, *auth.HasAccessRequest) (*auth.HasAccessReply, error) {
	return new(auth.HasAccessReply), nil
}
