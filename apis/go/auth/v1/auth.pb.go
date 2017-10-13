// Code generated by protoc-gen-go. DO NOT EDIT.
// source: auth/v1/auth.proto

/*
Package auth is a generated protocol buffer package.

It is generated from these files:
	auth/v1/auth.proto

It has these top-level messages:
	Empty
	Token
	Account
	User
	UserSession
	GetAccountRequest
	CreateAccountRequest
	UpdateAccountRequest
	ListTokensRequest
	ListTokensResponse
	GetUserRequest
	CreateUserRequest
	UpdateUserRequest
	UpdateUserPasswordRequest
	CreateUserSessionRequest
	AuthenticateRequest
	AuthContext
*/
package auth

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import google_protobuf "github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"

import (
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

// No response
type Empty struct {
}

func (m *Empty) Reset()                    { *m = Empty{} }
func (m *Empty) String() string            { return proto.CompactTextString(m) }
func (*Empty) ProtoMessage()               {}
func (*Empty) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type Token struct {
	// account the token belongs to
	AccountId int32 `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	// token key
	Key string `protobuf:"bytes,2,opt,name=key" json:"key,omitempty"`
	// list of scopes
	// by default every account gets 3 special tokens pregenerated
	// with scopes equal to: web, sdk, server
	PermissionScopes []string                   `protobuf:"bytes,3,rep,name=permission_scopes,json=permissionScopes" json:"permission_scopes,omitempty"`
	UpdatedAt        *google_protobuf.Timestamp `protobuf:"bytes,6,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
	CreatedAt        *google_protobuf.Timestamp `protobuf:"bytes,7,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
}

func (m *Token) Reset()                    { *m = Token{} }
func (m *Token) String() string            { return proto.CompactTextString(m) }
func (*Token) ProtoMessage()               {}
func (*Token) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *Token) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *Token) GetKey() string {
	if m != nil {
		return m.Key
	}
	return ""
}

func (m *Token) GetPermissionScopes() []string {
	if m != nil {
		return m.PermissionScopes
	}
	return nil
}

func (m *Token) GetUpdatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.UpdatedAt
	}
	return nil
}

func (m *Token) GetCreatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.CreatedAt
	}
	return nil
}

//
// Account represents customer account in the system
type Account struct {
	Id int32 `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	// The name of the account.
	// For example AirMiles
	Name      string                     `protobuf:"bytes,2,opt,name=name" json:"name,omitempty"`
	UpdatedAt *google_protobuf.Timestamp `protobuf:"bytes,3,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
	CreatedAt *google_protobuf.Timestamp `protobuf:"bytes,4,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
}

func (m *Account) Reset()                    { *m = Account{} }
func (m *Account) String() string            { return proto.CompactTextString(m) }
func (*Account) ProtoMessage()               {}
func (*Account) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *Account) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *Account) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Account) GetUpdatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.UpdatedAt
	}
	return nil
}

func (m *Account) GetCreatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.CreatedAt
	}
	return nil
}

//
// User represents a person that accesses the rover.io and acts on behalf of a customer account
type User struct {
	Id int32 `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	// the Account.id user belongs to
	AccountId int32 `protobuf:"varint,2,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	// The name of the user example Jacob
	Name string `protobuf:"bytes,3,opt,name=name" json:"name,omitempty"`
	// Must be unique accross all users
	Email            string                     `protobuf:"bytes,4,opt,name=email" json:"email,omitempty"`
	PermissionScopes []string                   `protobuf:"bytes,6,rep,name=permission_scopes,json=permissionScopes" json:"permission_scopes,omitempty"`
	UpdatedAt        *google_protobuf.Timestamp `protobuf:"bytes,7,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
	CreatedAt        *google_protobuf.Timestamp `protobuf:"bytes,8,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
}

func (m *User) Reset()                    { *m = User{} }
func (m *User) String() string            { return proto.CompactTextString(m) }
func (*User) ProtoMessage()               {}
func (*User) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *User) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *User) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *User) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *User) GetEmail() string {
	if m != nil {
		return m.Email
	}
	return ""
}

func (m *User) GetPermissionScopes() []string {
	if m != nil {
		return m.PermissionScopes
	}
	return nil
}

func (m *User) GetUpdatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.UpdatedAt
	}
	return nil
}

func (m *User) GetCreatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.CreatedAt
	}
	return nil
}

//
// UserSession represents a rover.io user session.
type UserSession struct {
	UserId int32 `protobuf:"varint,2,opt,name=user_id,json=userId" json:"user_id,omitempty"`
	// session key
	Key string `protobuf:"bytes,3,opt,name=key" json:"key,omitempty"`
	// last seen IP address
	LastSeen_IP string                     `protobuf:"bytes,4,opt,name=last_seen_IP,json=lastSeenIP" json:"last_seen_IP,omitempty"`
	ExpiresAt   *google_protobuf.Timestamp `protobuf:"bytes,5,opt,name=expires_at,json=expiresAt" json:"expires_at,omitempty"`
	CreatedAt   *google_protobuf.Timestamp `protobuf:"bytes,6,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
	// used as last_seen at timestamp
	UpdatedAt *google_protobuf.Timestamp `protobuf:"bytes,7,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
}

func (m *UserSession) Reset()                    { *m = UserSession{} }
func (m *UserSession) String() string            { return proto.CompactTextString(m) }
func (*UserSession) ProtoMessage()               {}
func (*UserSession) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

func (m *UserSession) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *UserSession) GetKey() string {
	if m != nil {
		return m.Key
	}
	return ""
}

func (m *UserSession) GetLastSeen_IP() string {
	if m != nil {
		return m.LastSeen_IP
	}
	return ""
}

func (m *UserSession) GetExpiresAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.ExpiresAt
	}
	return nil
}

func (m *UserSession) GetCreatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.CreatedAt
	}
	return nil
}

func (m *UserSession) GetUpdatedAt() *google_protobuf.Timestamp {
	if m != nil {
		return m.UpdatedAt
	}
	return nil
}

type GetAccountRequest struct {
	// The account id
	AccountId int32 `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
}

func (m *GetAccountRequest) Reset()                    { *m = GetAccountRequest{} }
func (m *GetAccountRequest) String() string            { return proto.CompactTextString(m) }
func (*GetAccountRequest) ProtoMessage()               {}
func (*GetAccountRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

func (m *GetAccountRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

type CreateAccountRequest struct {
	// The name of the account
	// All other attributes are auto generated
	Name string `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
}

func (m *CreateAccountRequest) Reset()                    { *m = CreateAccountRequest{} }
func (m *CreateAccountRequest) String() string            { return proto.CompactTextString(m) }
func (*CreateAccountRequest) ProtoMessage()               {}
func (*CreateAccountRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{6} }

func (m *CreateAccountRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

type UpdateAccountRequest struct {
	AccountId int32  `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	Name      string `protobuf:"bytes,2,opt,name=name" json:"name,omitempty"`
}

func (m *UpdateAccountRequest) Reset()                    { *m = UpdateAccountRequest{} }
func (m *UpdateAccountRequest) String() string            { return proto.CompactTextString(m) }
func (*UpdateAccountRequest) ProtoMessage()               {}
func (*UpdateAccountRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{7} }

func (m *UpdateAccountRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *UpdateAccountRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

type ListTokensRequest struct {
	AccountId int32 `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
}

func (m *ListTokensRequest) Reset()                    { *m = ListTokensRequest{} }
func (m *ListTokensRequest) String() string            { return proto.CompactTextString(m) }
func (*ListTokensRequest) ProtoMessage()               {}
func (*ListTokensRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{8} }

func (m *ListTokensRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

type ListTokensResponse struct {
	Tokens []*Token `protobuf:"bytes,1,rep,name=tokens" json:"tokens,omitempty"`
}

func (m *ListTokensResponse) Reset()                    { *m = ListTokensResponse{} }
func (m *ListTokensResponse) String() string            { return proto.CompactTextString(m) }
func (*ListTokensResponse) ProtoMessage()               {}
func (*ListTokensResponse) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{9} }

func (m *ListTokensResponse) GetTokens() []*Token {
	if m != nil {
		return m.Tokens
	}
	return nil
}

type GetUserRequest struct {
	AccountId int32 `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	UserId    int32 `protobuf:"varint,2,opt,name=user_id,json=userId" json:"user_id,omitempty"`
}

func (m *GetUserRequest) Reset()                    { *m = GetUserRequest{} }
func (m *GetUserRequest) String() string            { return proto.CompactTextString(m) }
func (*GetUserRequest) ProtoMessage()               {}
func (*GetUserRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{10} }

func (m *GetUserRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *GetUserRequest) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

type CreateUserRequest struct {
	AccountId int32  `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	Name      string `protobuf:"bytes,2,opt,name=name" json:"name,omitempty"`
	Email     string `protobuf:"bytes,3,opt,name=email" json:"email,omitempty"`
	Password  string `protobuf:"bytes,4,opt,name=password" json:"password,omitempty"`
}

func (m *CreateUserRequest) Reset()                    { *m = CreateUserRequest{} }
func (m *CreateUserRequest) String() string            { return proto.CompactTextString(m) }
func (*CreateUserRequest) ProtoMessage()               {}
func (*CreateUserRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{11} }

func (m *CreateUserRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *CreateUserRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *CreateUserRequest) GetEmail() string {
	if m != nil {
		return m.Email
	}
	return ""
}

func (m *CreateUserRequest) GetPassword() string {
	if m != nil {
		return m.Password
	}
	return ""
}

type UpdateUserRequest struct {
	AccountId int32  `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	UserId    int32  `protobuf:"varint,2,opt,name=user_id,json=userId" json:"user_id,omitempty"`
	Name      string `protobuf:"bytes,3,opt,name=name" json:"name,omitempty"`
	Email     string `protobuf:"bytes,4,opt,name=email" json:"email,omitempty"`
}

func (m *UpdateUserRequest) Reset()                    { *m = UpdateUserRequest{} }
func (m *UpdateUserRequest) String() string            { return proto.CompactTextString(m) }
func (*UpdateUserRequest) ProtoMessage()               {}
func (*UpdateUserRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{12} }

func (m *UpdateUserRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *UpdateUserRequest) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *UpdateUserRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *UpdateUserRequest) GetEmail() string {
	if m != nil {
		return m.Email
	}
	return ""
}

type UpdateUserPasswordRequest struct {
	AccountId int32  `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	UserId    int32  `protobuf:"varint,2,opt,name=user_id,json=userId" json:"user_id,omitempty"`
	Password  string `protobuf:"bytes,3,opt,name=password" json:"password,omitempty"`
}

func (m *UpdateUserPasswordRequest) Reset()                    { *m = UpdateUserPasswordRequest{} }
func (m *UpdateUserPasswordRequest) String() string            { return proto.CompactTextString(m) }
func (*UpdateUserPasswordRequest) ProtoMessage()               {}
func (*UpdateUserPasswordRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{13} }

func (m *UpdateUserPasswordRequest) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *UpdateUserPasswordRequest) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *UpdateUserPasswordRequest) GetPassword() string {
	if m != nil {
		return m.Password
	}
	return ""
}

type CreateUserSessionRequest struct {
	Email       string `protobuf:"bytes,1,opt,name=email" json:"email,omitempty"`
	Password    string `protobuf:"bytes,2,opt,name=password" json:"password,omitempty"`
	LastSeen_IP string `protobuf:"bytes,3,opt,name=last_seen_IP,json=lastSeenIP" json:"last_seen_IP,omitempty"`
}

func (m *CreateUserSessionRequest) Reset()                    { *m = CreateUserSessionRequest{} }
func (m *CreateUserSessionRequest) String() string            { return proto.CompactTextString(m) }
func (*CreateUserSessionRequest) ProtoMessage()               {}
func (*CreateUserSessionRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{14} }

func (m *CreateUserSessionRequest) GetEmail() string {
	if m != nil {
		return m.Email
	}
	return ""
}

func (m *CreateUserSessionRequest) GetPassword() string {
	if m != nil {
		return m.Password
	}
	return ""
}

func (m *CreateUserSessionRequest) GetLastSeen_IP() string {
	if m != nil {
		return m.LastSeen_IP
	}
	return ""
}

type AuthenticateRequest struct {
	// one of the: token key or session key
	Key string `protobuf:"bytes,1,opt,name=key" json:"key,omitempty"`
	// last seen ip
	LastSeen_IP string `protobuf:"bytes,2,opt,name=last_seen_IP,json=lastSeenIP" json:"last_seen_IP,omitempty"`
}

func (m *AuthenticateRequest) Reset()                    { *m = AuthenticateRequest{} }
func (m *AuthenticateRequest) String() string            { return proto.CompactTextString(m) }
func (*AuthenticateRequest) ProtoMessage()               {}
func (*AuthenticateRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{15} }

func (m *AuthenticateRequest) GetKey() string {
	if m != nil {
		return m.Key
	}
	return ""
}

func (m *AuthenticateRequest) GetLastSeen_IP() string {
	if m != nil {
		return m.LastSeen_IP
	}
	return ""
}

// Authentication context auth reploy
type AuthContext struct {
	// the Account.id the context is bound to
	AccountId int32 `protobuf:"varint,1,opt,name=account_id,json=accountId" json:"account_id,omitempty"`
	// the User.id the context is bound to
	// optional
	UserId int32 `protobuf:"varint,2,opt,name=user_id,json=userId" json:"user_id,omitempty"`
	// string tokens the context is bound to
	PermissionScopes []string `protobuf:"bytes,3,rep,name=permission_scopes,json=permissionScopes" json:"permission_scopes,omitempty"`
}

func (m *AuthContext) Reset()                    { *m = AuthContext{} }
func (m *AuthContext) String() string            { return proto.CompactTextString(m) }
func (*AuthContext) ProtoMessage()               {}
func (*AuthContext) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{16} }

func (m *AuthContext) GetAccountId() int32 {
	if m != nil {
		return m.AccountId
	}
	return 0
}

func (m *AuthContext) GetUserId() int32 {
	if m != nil {
		return m.UserId
	}
	return 0
}

func (m *AuthContext) GetPermissionScopes() []string {
	if m != nil {
		return m.PermissionScopes
	}
	return nil
}

func init() {
	proto.RegisterType((*Empty)(nil), "rover.auth.v1.Empty")
	proto.RegisterType((*Token)(nil), "rover.auth.v1.Token")
	proto.RegisterType((*Account)(nil), "rover.auth.v1.Account")
	proto.RegisterType((*User)(nil), "rover.auth.v1.User")
	proto.RegisterType((*UserSession)(nil), "rover.auth.v1.UserSession")
	proto.RegisterType((*GetAccountRequest)(nil), "rover.auth.v1.GetAccountRequest")
	proto.RegisterType((*CreateAccountRequest)(nil), "rover.auth.v1.CreateAccountRequest")
	proto.RegisterType((*UpdateAccountRequest)(nil), "rover.auth.v1.UpdateAccountRequest")
	proto.RegisterType((*ListTokensRequest)(nil), "rover.auth.v1.ListTokensRequest")
	proto.RegisterType((*ListTokensResponse)(nil), "rover.auth.v1.ListTokensResponse")
	proto.RegisterType((*GetUserRequest)(nil), "rover.auth.v1.GetUserRequest")
	proto.RegisterType((*CreateUserRequest)(nil), "rover.auth.v1.CreateUserRequest")
	proto.RegisterType((*UpdateUserRequest)(nil), "rover.auth.v1.UpdateUserRequest")
	proto.RegisterType((*UpdateUserPasswordRequest)(nil), "rover.auth.v1.UpdateUserPasswordRequest")
	proto.RegisterType((*CreateUserSessionRequest)(nil), "rover.auth.v1.CreateUserSessionRequest")
	proto.RegisterType((*AuthenticateRequest)(nil), "rover.auth.v1.AuthenticateRequest")
	proto.RegisterType((*AuthContext)(nil), "rover.auth.v1.AuthContext")
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// Client API for Auth service

type AuthClient interface {
	//
	// Basic CRUD operations for Accounts
	GetAccount(ctx context.Context, in *GetAccountRequest, opts ...grpc.CallOption) (*Account, error)
	CreateAccount(ctx context.Context, in *CreateAccountRequest, opts ...grpc.CallOption) (*Account, error)
	UpdateAccount(ctx context.Context, in *UpdateAccountRequest, opts ...grpc.CallOption) (*Account, error)
	ListTokens(ctx context.Context, in *ListTokensRequest, opts ...grpc.CallOption) (*ListTokensResponse, error)
	//
	// Basic CRUD operations for Users
	GetUser(ctx context.Context, in *GetUserRequest, opts ...grpc.CallOption) (*User, error)
	CreateUser(ctx context.Context, in *CreateUserRequest, opts ...grpc.CallOption) (*User, error)
	UpdateUser(ctx context.Context, in *UpdateUserRequest, opts ...grpc.CallOption) (*User, error)
	UpdateUserPassword(ctx context.Context, in *UpdateUserPasswordRequest, opts ...grpc.CallOption) (*Empty, error)
	//
	// A user session is simple sign on using email & password based authentication to generate a new session token
	CreateUserSession(ctx context.Context, in *CreateUserSessionRequest, opts ...grpc.CallOption) (*UserSession, error)
	//
	// Checks whether the supplied token/user_session is valid
	AuthenticateToken(ctx context.Context, in *AuthenticateRequest, opts ...grpc.CallOption) (*AuthContext, error)
	AuthenticateUserSession(ctx context.Context, in *AuthenticateRequest, opts ...grpc.CallOption) (*AuthContext, error)
}

type authClient struct {
	cc *grpc.ClientConn
}

func NewAuthClient(cc *grpc.ClientConn) AuthClient {
	return &authClient{cc}
}

func (c *authClient) GetAccount(ctx context.Context, in *GetAccountRequest, opts ...grpc.CallOption) (*Account, error) {
	out := new(Account)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/GetAccount", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) CreateAccount(ctx context.Context, in *CreateAccountRequest, opts ...grpc.CallOption) (*Account, error) {
	out := new(Account)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/CreateAccount", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) UpdateAccount(ctx context.Context, in *UpdateAccountRequest, opts ...grpc.CallOption) (*Account, error) {
	out := new(Account)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/UpdateAccount", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) ListTokens(ctx context.Context, in *ListTokensRequest, opts ...grpc.CallOption) (*ListTokensResponse, error) {
	out := new(ListTokensResponse)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/ListTokens", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) GetUser(ctx context.Context, in *GetUserRequest, opts ...grpc.CallOption) (*User, error) {
	out := new(User)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/GetUser", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) CreateUser(ctx context.Context, in *CreateUserRequest, opts ...grpc.CallOption) (*User, error) {
	out := new(User)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/CreateUser", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) UpdateUser(ctx context.Context, in *UpdateUserRequest, opts ...grpc.CallOption) (*User, error) {
	out := new(User)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/UpdateUser", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) UpdateUserPassword(ctx context.Context, in *UpdateUserPasswordRequest, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/UpdateUserPassword", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) CreateUserSession(ctx context.Context, in *CreateUserSessionRequest, opts ...grpc.CallOption) (*UserSession, error) {
	out := new(UserSession)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/CreateUserSession", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) AuthenticateToken(ctx context.Context, in *AuthenticateRequest, opts ...grpc.CallOption) (*AuthContext, error) {
	out := new(AuthContext)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/AuthenticateToken", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authClient) AuthenticateUserSession(ctx context.Context, in *AuthenticateRequest, opts ...grpc.CallOption) (*AuthContext, error) {
	out := new(AuthContext)
	err := grpc.Invoke(ctx, "/rover.auth.v1.Auth/AuthenticateUserSession", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Auth service

type AuthServer interface {
	//
	// Basic CRUD operations for Accounts
	GetAccount(context.Context, *GetAccountRequest) (*Account, error)
	CreateAccount(context.Context, *CreateAccountRequest) (*Account, error)
	UpdateAccount(context.Context, *UpdateAccountRequest) (*Account, error)
	ListTokens(context.Context, *ListTokensRequest) (*ListTokensResponse, error)
	//
	// Basic CRUD operations for Users
	GetUser(context.Context, *GetUserRequest) (*User, error)
	CreateUser(context.Context, *CreateUserRequest) (*User, error)
	UpdateUser(context.Context, *UpdateUserRequest) (*User, error)
	UpdateUserPassword(context.Context, *UpdateUserPasswordRequest) (*Empty, error)
	//
	// A user session is simple sign on using email & password based authentication to generate a new session token
	CreateUserSession(context.Context, *CreateUserSessionRequest) (*UserSession, error)
	//
	// Checks whether the supplied token/user_session is valid
	AuthenticateToken(context.Context, *AuthenticateRequest) (*AuthContext, error)
	AuthenticateUserSession(context.Context, *AuthenticateRequest) (*AuthContext, error)
}

func RegisterAuthServer(s *grpc.Server, srv AuthServer) {
	s.RegisterService(&_Auth_serviceDesc, srv)
}

func _Auth_GetAccount_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAccountRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).GetAccount(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/GetAccount",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).GetAccount(ctx, req.(*GetAccountRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_CreateAccount_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateAccountRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).CreateAccount(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/CreateAccount",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).CreateAccount(ctx, req.(*CreateAccountRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_UpdateAccount_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateAccountRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).UpdateAccount(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/UpdateAccount",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).UpdateAccount(ctx, req.(*UpdateAccountRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_ListTokens_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListTokensRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).ListTokens(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/ListTokens",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).ListTokens(ctx, req.(*ListTokensRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_GetUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetUserRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).GetUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/GetUser",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).GetUser(ctx, req.(*GetUserRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_CreateUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateUserRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).CreateUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/CreateUser",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).CreateUser(ctx, req.(*CreateUserRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_UpdateUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateUserRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).UpdateUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/UpdateUser",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).UpdateUser(ctx, req.(*UpdateUserRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_UpdateUserPassword_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateUserPasswordRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).UpdateUserPassword(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/UpdateUserPassword",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).UpdateUserPassword(ctx, req.(*UpdateUserPasswordRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_CreateUserSession_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateUserSessionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).CreateUserSession(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/CreateUserSession",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).CreateUserSession(ctx, req.(*CreateUserSessionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_AuthenticateToken_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AuthenticateRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).AuthenticateToken(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/AuthenticateToken",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).AuthenticateToken(ctx, req.(*AuthenticateRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Auth_AuthenticateUserSession_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AuthenticateRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthServer).AuthenticateUserSession(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rover.auth.v1.Auth/AuthenticateUserSession",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthServer).AuthenticateUserSession(ctx, req.(*AuthenticateRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Auth_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rover.auth.v1.Auth",
	HandlerType: (*AuthServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAccount",
			Handler:    _Auth_GetAccount_Handler,
		},
		{
			MethodName: "CreateAccount",
			Handler:    _Auth_CreateAccount_Handler,
		},
		{
			MethodName: "UpdateAccount",
			Handler:    _Auth_UpdateAccount_Handler,
		},
		{
			MethodName: "ListTokens",
			Handler:    _Auth_ListTokens_Handler,
		},
		{
			MethodName: "GetUser",
			Handler:    _Auth_GetUser_Handler,
		},
		{
			MethodName: "CreateUser",
			Handler:    _Auth_CreateUser_Handler,
		},
		{
			MethodName: "UpdateUser",
			Handler:    _Auth_UpdateUser_Handler,
		},
		{
			MethodName: "UpdateUserPassword",
			Handler:    _Auth_UpdateUserPassword_Handler,
		},
		{
			MethodName: "CreateUserSession",
			Handler:    _Auth_CreateUserSession_Handler,
		},
		{
			MethodName: "AuthenticateToken",
			Handler:    _Auth_AuthenticateToken_Handler,
		},
		{
			MethodName: "AuthenticateUserSession",
			Handler:    _Auth_AuthenticateUserSession_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "auth/v1/auth.proto",
}

func init() { proto.RegisterFile("auth/v1/auth.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 783 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x09, 0x6e, 0x88, 0x02, 0xff, 0xac, 0x56, 0x4d, 0x4f, 0xdb, 0x4a,
	0x14, 0xc5, 0x76, 0xe2, 0x90, 0xcb, 0x87, 0xc8, 0x10, 0x3d, 0xf2, 0x2c, 0xa1, 0x97, 0xe7, 0xb7,
	0x78, 0xa8, 0xad, 0x1c, 0x41, 0x57, 0x55, 0x17, 0x55, 0x40, 0xa8, 0x44, 0xaa, 0x2a, 0x94, 0x40,
	0x17, 0x74, 0x11, 0x99, 0x64, 0x4a, 0x2d, 0x88, 0xc7, 0xf5, 0x8c, 0x29, 0x6c, 0xbb, 0xed, 0xcf,
	0xe8, 0xcf, 0xea, 0x5f, 0xe9, 0xa2, 0x33, 0xf6, 0x38, 0x76, 0x3c, 0x49, 0x48, 0xa0, 0xab, 0xc4,
	0x33, 0x77, 0xce, 0x3d, 0xf7, 0xce, 0x3d, 0xc7, 0x06, 0xe4, 0x46, 0xec, 0x73, 0xeb, 0x76, 0xbf,
	0x25, 0x7e, 0x9d, 0x20, 0x24, 0x8c, 0xa0, 0x8d, 0x90, 0xdc, 0xe2, 0xd0, 0x89, 0x57, 0x6e, 0xf7,
	0xad, 0x7f, 0xae, 0x08, 0xb9, 0xba, 0xc1, 0xad, 0x78, 0xf3, 0x32, 0xfa, 0xd4, 0x62, 0xde, 0x08,
	0x53, 0xe6, 0x8e, 0x82, 0x24, 0xde, 0xae, 0x40, 0xf9, 0x78, 0x14, 0xb0, 0x7b, 0xfb, 0xa7, 0x06,
	0xe5, 0x33, 0x72, 0x8d, 0x7d, 0xb4, 0x0b, 0xe0, 0x0e, 0x06, 0x24, 0xf2, 0x59, 0xdf, 0x1b, 0x36,
	0xb4, 0xa6, 0xb6, 0x57, 0xee, 0x56, 0xe5, 0x4a, 0x67, 0x88, 0xb6, 0xc0, 0xb8, 0xc6, 0xf7, 0x0d,
	0x9d, 0xaf, 0x57, 0xbb, 0xe2, 0x2f, 0x7a, 0x0e, 0xb5, 0x00, 0x87, 0x23, 0x8f, 0x52, 0x8f, 0xf8,
	0x7d, 0x3a, 0x20, 0x01, 0xa6, 0x0d, 0xa3, 0x69, 0xf0, 0xfd, 0xad, 0x6c, 0xa3, 0x17, 0xaf, 0xa3,
	0x57, 0x00, 0x51, 0x30, 0x74, 0x19, 0x1e, 0xf6, 0x5d, 0xd6, 0x30, 0x39, 0xca, 0xda, 0x81, 0xe5,
	0x24, 0x34, 0x9d, 0x94, 0xa6, 0x73, 0x96, 0xd2, 0xec, 0x56, 0x65, 0x74, 0x9b, 0x89, 0xa3, 0x83,
	0x10, 0xa7, 0x47, 0x2b, 0x0f, 0x1f, 0x95, 0xd1, 0x6d, 0x66, 0xff, 0xd0, 0xa0, 0xd2, 0x4e, 0x4a,
	0x40, 0x9b, 0xa0, 0x8f, 0xeb, 0xe2, 0xff, 0x10, 0x82, 0x92, 0xef, 0x8e, 0xb0, 0xac, 0x28, 0xfe,
	0x5f, 0x60, 0x69, 0x3c, 0x9e, 0x65, 0x69, 0x19, 0x96, 0xdf, 0x74, 0x28, 0x9d, 0x53, 0x1c, 0x2a,
	0x14, 0x27, 0xaf, 0x44, 0x2f, 0x5e, 0x49, 0x5a, 0x81, 0x91, 0xab, 0xa0, 0x0e, 0x65, 0x3c, 0x72,
	0xbd, 0x9b, 0x98, 0x41, 0xb5, 0x9b, 0x3c, 0x4c, 0xbf, 0x2a, 0x73, 0xa1, 0xab, 0xaa, 0x3c, 0xbe,
	0x09, 0xab, 0xcb, 0x34, 0xe1, 0xbb, 0x0e, 0x6b, 0xa2, 0x09, 0x3d, 0x1c, 0x73, 0x41, 0x3b, 0x50,
	0x89, 0xf8, 0x63, 0x56, 0xb8, 0x29, 0x1e, 0xb3, 0x41, 0x34, 0xb2, 0x41, 0x6c, 0xc2, 0xfa, 0x8d,
	0x4b, 0x59, 0x9f, 0x62, 0xec, 0xf7, 0x3b, 0xa7, 0xb2, 0x74, 0x10, 0x6b, 0x3d, 0xbe, 0xd4, 0x39,
	0x15, 0xbc, 0xf0, 0x5d, 0xe0, 0x85, 0x98, 0x0a, 0x5e, 0xe5, 0x87, 0x79, 0xc9, 0x68, 0xa5, 0x24,
	0x73, 0x89, 0x92, 0x9e, 0xd0, 0x48, 0xfb, 0x00, 0x6a, 0x6f, 0x31, 0x93, 0xa3, 0xdb, 0xc5, 0x5f,
	0x22, 0x1e, 0xf2, 0x80, 0x42, 0xed, 0x67, 0x50, 0x3f, 0x8a, 0x73, 0x17, 0x8e, 0xa5, 0x63, 0xa2,
	0x65, 0x63, 0x62, 0x77, 0xa0, 0x7e, 0x1e, 0x27, 0x5b, 0x2a, 0xc5, 0x34, 0xcd, 0x08, 0xaa, 0xef,
	0x3c, 0xca, 0x62, 0x13, 0xa1, 0x0b, 0x52, 0x3d, 0x04, 0x94, 0x3f, 0x43, 0x03, 0xe2, 0x53, 0x8c,
	0x5e, 0x80, 0xc9, 0xe2, 0x15, 0x7e, 0xc0, 0xe0, 0xbd, 0xaa, 0x3b, 0x13, 0xae, 0xe6, 0xc4, 0xe1,
	0x5d, 0x19, 0x63, 0x9f, 0xc0, 0x26, 0x6f, 0x91, 0x18, 0x99, 0x05, 0xc9, 0xcf, 0x9a, 0x28, 0xfb,
	0x0e, 0x6a, 0x49, 0xe3, 0x96, 0x00, 0x9b, 0xe6, 0x1e, 0x63, 0xed, 0x19, 0x79, 0xed, 0x59, 0xb0,
	0x1a, 0xb8, 0x94, 0x7e, 0x25, 0xe1, 0x50, 0x4e, 0xe6, 0xf8, 0xd9, 0x8e, 0xa0, 0x96, 0x5c, 0xc3,
	0x1f, 0x28, 0x63, 0x71, 0x3b, 0xb0, 0x09, 0xfc, 0x9d, 0xa5, 0x3d, 0x95, 0x64, 0x9e, 0x9a, 0x3e,
	0x5f, 0xa7, 0x51, 0xa8, 0xd3, 0x87, 0x46, 0xd6, 0x61, 0xa9, 0xf0, 0x34, 0xdf, 0x98, 0xa2, 0x36,
	0xab, 0x6b, 0xfa, 0x24, 0x9a, 0xa2, 0x77, 0xa3, 0xa8, 0x77, 0x3e, 0xde, 0xdb, 0x6d, 0x3e, 0x34,
	0xd8, 0x67, 0xde, 0x80, 0x67, 0x4d, 0x53, 0x49, 0xeb, 0xd0, 0x66, 0x5b, 0x87, 0xae, 0x40, 0x85,
	0xb0, 0x26, 0xa0, 0x8e, 0x88, 0xcf, 0xf0, 0xdd, 0xe3, 0xbb, 0xb3, 0xcc, 0xcb, 0xf2, 0xe0, 0x97,
	0x09, 0x25, 0x91, 0x14, 0x9d, 0x00, 0x64, 0x36, 0x80, 0x9a, 0x05, 0x3d, 0x28, 0x0e, 0x61, 0xfd,
	0x55, 0x88, 0x90, 0xdb, 0xf6, 0x0a, 0x7a, 0x0f, 0x1b, 0x13, 0xe6, 0x80, 0xfe, 0x2b, 0x84, 0x4e,
	0xb3, 0x8e, 0xf9, 0x78, 0x13, 0x06, 0xa2, 0xe0, 0x4d, 0xb3, 0x97, 0x39, 0x78, 0x3d, 0x80, 0xcc,
	0x11, 0x94, 0x4a, 0x15, 0x83, 0xb1, 0xfe, 0x9d, 0x13, 0x91, 0xd8, 0x09, 0x07, 0x7d, 0x03, 0x15,
	0x69, 0x11, 0x68, 0x57, 0xed, 0x5d, 0x4e, 0x73, 0xd6, 0x76, 0x91, 0x3d, 0xdf, 0xe3, 0x00, 0xc7,
	0x00, 0xd9, 0xdc, 0x2a, 0xac, 0x14, 0xd3, 0x98, 0x03, 0x93, 0xe9, 0x4d, 0x81, 0x51, 0x1c, 0x60,
	0x16, 0xcc, 0x07, 0x40, 0xaa, 0x6c, 0xd1, 0xde, 0x4c, 0xb8, 0x82, 0xb2, 0xad, 0xa2, 0x9f, 0x26,
	0x5f, 0x80, 0x2b, 0xe8, 0x22, 0xef, 0x7f, 0xe9, 0xfb, 0xf7, 0xff, 0x99, 0xc5, 0x4e, 0xea, 0xd7,
	0xb2, 0xa6, 0x90, 0x95, 0x21, 0x1c, 0xfb, 0x1c, 0x6a, 0x79, 0x25, 0x26, 0x9f, 0x9a, 0x76, 0x71,
	0x0c, 0x54, 0xad, 0x2a, 0xb0, 0x39, 0x11, 0x72, 0xd8, 0x8f, 0xb0, 0x93, 0x3f, 0x94, 0x27, 0xfe,
	0x64, 0xf0, 0xc3, 0xcd, 0x8b, 0x75, 0xf9, 0x89, 0xfd, 0x5a, 0xfc, 0x5e, 0x9a, 0xf1, 0xbb, 0xfa,
	0xe5, 0xef, 0x00, 0x00, 0x00, 0xff, 0xff, 0xb0, 0xfa, 0x77, 0xa8, 0x79, 0x0b, 0x00, 0x00,
}
