// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_rover_auth_v1_Account(arg) {
  if (!(arg instanceof auth_v1_auth_pb.Account)) {
    throw new Error('Expected argument of type rover.auth.v1.Account');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_Account(buffer_arg) {
  return auth_v1_auth_pb.Account.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_AuthContext(arg) {
  if (!(arg instanceof auth_v1_auth_pb.AuthContext)) {
    throw new Error('Expected argument of type rover.auth.v1.AuthContext');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_AuthContext(buffer_arg) {
  return auth_v1_auth_pb.AuthContext.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_AuthenticateRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.AuthenticateRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.AuthenticateRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_AuthenticateRequest(buffer_arg) {
  return auth_v1_auth_pb.AuthenticateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_CreateAccountRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.CreateAccountRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.CreateAccountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_CreateAccountRequest(buffer_arg) {
  return auth_v1_auth_pb.CreateAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_CreateUserRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.CreateUserRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.CreateUserRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_CreateUserRequest(buffer_arg) {
  return auth_v1_auth_pb.CreateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_CreateUserSessionRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.CreateUserSessionRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.CreateUserSessionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_CreateUserSessionRequest(buffer_arg) {
  return auth_v1_auth_pb.CreateUserSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_Empty(arg) {
  if (!(arg instanceof auth_v1_auth_pb.Empty)) {
    throw new Error('Expected argument of type rover.auth.v1.Empty');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_Empty(buffer_arg) {
  return auth_v1_auth_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_GetAccountRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.GetAccountRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.GetAccountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_GetAccountRequest(buffer_arg) {
  return auth_v1_auth_pb.GetAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_GetUserInfoRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.GetUserInfoRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.GetUserInfoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_GetUserInfoRequest(buffer_arg) {
  return auth_v1_auth_pb.GetUserInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_GetUserInfoResponse(arg) {
  if (!(arg instanceof auth_v1_auth_pb.GetUserInfoResponse)) {
    throw new Error('Expected argument of type rover.auth.v1.GetUserInfoResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_GetUserInfoResponse(buffer_arg) {
  return auth_v1_auth_pb.GetUserInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_GetUserRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.GetUserRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.GetUserRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_GetUserRequest(buffer_arg) {
  return auth_v1_auth_pb.GetUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_ListAccountsRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.ListAccountsRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.ListAccountsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_ListAccountsRequest(buffer_arg) {
  return auth_v1_auth_pb.ListAccountsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_ListAccountsResponse(arg) {
  if (!(arg instanceof auth_v1_auth_pb.ListAccountsResponse)) {
    throw new Error('Expected argument of type rover.auth.v1.ListAccountsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_ListAccountsResponse(buffer_arg) {
  return auth_v1_auth_pb.ListAccountsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_ListTokensRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.ListTokensRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.ListTokensRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_ListTokensRequest(buffer_arg) {
  return auth_v1_auth_pb.ListTokensRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_ListTokensResponse(arg) {
  if (!(arg instanceof auth_v1_auth_pb.ListTokensResponse)) {
    throw new Error('Expected argument of type rover.auth.v1.ListTokensResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_ListTokensResponse(buffer_arg) {
  return auth_v1_auth_pb.ListTokensResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_ListUsersRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.ListUsersRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.ListUsersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_ListUsersRequest(buffer_arg) {
  return auth_v1_auth_pb.ListUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_ListUsersResponse(arg) {
  if (!(arg instanceof auth_v1_auth_pb.ListUsersResponse)) {
    throw new Error('Expected argument of type rover.auth.v1.ListUsersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_ListUsersResponse(buffer_arg) {
  return auth_v1_auth_pb.ListUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_UpdateAccountRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.UpdateAccountRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.UpdateAccountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_UpdateAccountRequest(buffer_arg) {
  return auth_v1_auth_pb.UpdateAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_UpdateUserPasswordRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.UpdateUserPasswordRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.UpdateUserPasswordRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_UpdateUserPasswordRequest(buffer_arg) {
  return auth_v1_auth_pb.UpdateUserPasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_UpdateUserRequest(arg) {
  if (!(arg instanceof auth_v1_auth_pb.UpdateUserRequest)) {
    throw new Error('Expected argument of type rover.auth.v1.UpdateUserRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_UpdateUserRequest(buffer_arg) {
  return auth_v1_auth_pb.UpdateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_User(arg) {
  if (!(arg instanceof auth_v1_auth_pb.User)) {
    throw new Error('Expected argument of type rover.auth.v1.User');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_User(buffer_arg) {
  return auth_v1_auth_pb.User.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_auth_v1_UserSession(arg) {
  if (!(arg instanceof auth_v1_auth_pb.UserSession)) {
    throw new Error('Expected argument of type rover.auth.v1.UserSession');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_auth_v1_UserSession(buffer_arg) {
  return auth_v1_auth_pb.UserSession.deserializeBinary(new Uint8Array(buffer_arg));
}


//
// # Auth
//
// Auth is responsible for authenticating and authorizing all api requests coming
// in. The Auth service resides within a trusted network and assumes strusted clients.
//
// +----------------+         +------------------+
// |                |         |                  |
// |                |         |                  |
// |    Auth Svc    |         |    Beacon Svc    |
// |                |         |                  |
// |                |         |                  |
// +----^-----------+         +---------^--------+
// |        3                  5   |
// +----------+           +--------+
// 2      |     4    |     
// +------------------+
// |                  |
// |                  |
// |   GraphQL gateway|
// |                  |
// |                  |
// +--------^---------+
// |
// |
// 1 |  6
// |
// |
// +---------------+
// |               |
// |   an api/web  |
// |    client     |
// +---------------+
//
//
// 0. A client wants to delete a beacon with id=1 account_id=1
// 1. The client reaches the gateway with a session Cookie or a `Authentication: Bearer <token>` header
// 2. GraphQL takes the the session/token key and authenticates with the auth svc
// 2.1 if no associated token/session info found - auth service returns an error which graphql propagates back to the client
// 3. if there's an associated info then auth svc returns it account_id=1 user_id=1 scopes=[web,admin:ibeacon]
// 4. the gateway given the scopes decides whether a client has enough privileges to call the becaons service and 
// 4.1. in case of insufficient privileges the error is returned
// 5. otherwise the graphql delegates the deletion to the beacon service
// 6. the success is propagaged all the way to the client
//
// ## Use Cases
//
// ### Customer SDK access
//
// As a mobile app user wich has the SDK installed in an app of our Customer
// I want the SDK to be able to access rover APIs
// So in order to do it I need an account token with SDK scope
//
// ### Server access
//
// As a customer I want to be able to make api calls so I need a server token
//
// ### Web Analytics 
//
// As a web viewer when i browse a web experience I want the analytics code to be able to push events to API
// using a token with restricted permissions(so nothing else is comprimised)
//
// ### User sessions at the Rover.io
//
// As a rover.io user i want to be able to login to rover.io through the login page
// I'll have to re-login after some time (configurabel) time of inactivity.
//
// Sessions track a single user sign-on session. This is used to keep track of
// things like when was the user last seen & what ip was used last. Sessions also
// auto expire after 24 hours ( configurable ). Once a session has expired the
// token is no longer valid and the user should be signed out of the front end.
// However a session is prolonged as long as the user accesses any of the front
// end apps. An example would be if the session has 10 mins remaining and a user
// accesses the messages app which calls the messages api. The session will now be
// extended for another 24 hours
//
//
//
//
// Service for authentication of Users and Accounts
// as well as ACL for the resource access
//
var AuthService = exports.AuthService = {
  //
  // Basic CRUD operations for Accounts
  getAccount: {
    path: '/rover.auth.v1.Auth/GetAccount',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.GetAccountRequest,
    responseType: auth_v1_auth_pb.Account,
    requestSerialize: serialize_rover_auth_v1_GetAccountRequest,
    requestDeserialize: deserialize_rover_auth_v1_GetAccountRequest,
    responseSerialize: serialize_rover_auth_v1_Account,
    responseDeserialize: deserialize_rover_auth_v1_Account,
  },
  createAccount: {
    path: '/rover.auth.v1.Auth/CreateAccount',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.CreateAccountRequest,
    responseType: auth_v1_auth_pb.Account,
    requestSerialize: serialize_rover_auth_v1_CreateAccountRequest,
    requestDeserialize: deserialize_rover_auth_v1_CreateAccountRequest,
    responseSerialize: serialize_rover_auth_v1_Account,
    responseDeserialize: deserialize_rover_auth_v1_Account,
  },
  updateAccount: {
    path: '/rover.auth.v1.Auth/UpdateAccount',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.UpdateAccountRequest,
    responseType: auth_v1_auth_pb.Account,
    requestSerialize: serialize_rover_auth_v1_UpdateAccountRequest,
    requestDeserialize: deserialize_rover_auth_v1_UpdateAccountRequest,
    responseSerialize: serialize_rover_auth_v1_Account,
    responseDeserialize: deserialize_rover_auth_v1_Account,
  },
  listTokens: {
    path: '/rover.auth.v1.Auth/ListTokens',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.ListTokensRequest,
    responseType: auth_v1_auth_pb.ListTokensResponse,
    requestSerialize: serialize_rover_auth_v1_ListTokensRequest,
    requestDeserialize: deserialize_rover_auth_v1_ListTokensRequest,
    responseSerialize: serialize_rover_auth_v1_ListTokensResponse,
    responseDeserialize: deserialize_rover_auth_v1_ListTokensResponse,
  },
  listAccounts: {
    path: '/rover.auth.v1.Auth/ListAccounts',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.ListAccountsRequest,
    responseType: auth_v1_auth_pb.ListAccountsResponse,
    requestSerialize: serialize_rover_auth_v1_ListAccountsRequest,
    requestDeserialize: deserialize_rover_auth_v1_ListAccountsRequest,
    responseSerialize: serialize_rover_auth_v1_ListAccountsResponse,
    responseDeserialize: deserialize_rover_auth_v1_ListAccountsResponse,
  },
  //
  // Basic CRUD operations for Users
  getUser: {
    path: '/rover.auth.v1.Auth/GetUser',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.GetUserRequest,
    responseType: auth_v1_auth_pb.User,
    requestSerialize: serialize_rover_auth_v1_GetUserRequest,
    requestDeserialize: deserialize_rover_auth_v1_GetUserRequest,
    responseSerialize: serialize_rover_auth_v1_User,
    responseDeserialize: deserialize_rover_auth_v1_User,
  },
  createUser: {
    path: '/rover.auth.v1.Auth/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.CreateUserRequest,
    responseType: auth_v1_auth_pb.User,
    requestSerialize: serialize_rover_auth_v1_CreateUserRequest,
    requestDeserialize: deserialize_rover_auth_v1_CreateUserRequest,
    responseSerialize: serialize_rover_auth_v1_User,
    responseDeserialize: deserialize_rover_auth_v1_User,
  },
  updateUser: {
    path: '/rover.auth.v1.Auth/UpdateUser',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.UpdateUserRequest,
    responseType: auth_v1_auth_pb.User,
    requestSerialize: serialize_rover_auth_v1_UpdateUserRequest,
    requestDeserialize: deserialize_rover_auth_v1_UpdateUserRequest,
    responseSerialize: serialize_rover_auth_v1_User,
    responseDeserialize: deserialize_rover_auth_v1_User,
  },
  updateUserPassword: {
    path: '/rover.auth.v1.Auth/UpdateUserPassword',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.UpdateUserPasswordRequest,
    responseType: auth_v1_auth_pb.Empty,
    requestSerialize: serialize_rover_auth_v1_UpdateUserPasswordRequest,
    requestDeserialize: deserialize_rover_auth_v1_UpdateUserPasswordRequest,
    responseSerialize: serialize_rover_auth_v1_Empty,
    responseDeserialize: deserialize_rover_auth_v1_Empty,
  },
  getUserInfo: {
    path: '/rover.auth.v1.Auth/GetUserInfo',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.GetUserInfoRequest,
    responseType: auth_v1_auth_pb.GetUserInfoResponse,
    requestSerialize: serialize_rover_auth_v1_GetUserInfoRequest,
    requestDeserialize: deserialize_rover_auth_v1_GetUserInfoRequest,
    responseSerialize: serialize_rover_auth_v1_GetUserInfoResponse,
    responseDeserialize: deserialize_rover_auth_v1_GetUserInfoResponse,
  },
  listUsers: {
    path: '/rover.auth.v1.Auth/ListUsers',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.ListUsersRequest,
    responseType: auth_v1_auth_pb.ListUsersResponse,
    requestSerialize: serialize_rover_auth_v1_ListUsersRequest,
    requestDeserialize: deserialize_rover_auth_v1_ListUsersRequest,
    responseSerialize: serialize_rover_auth_v1_ListUsersResponse,
    responseDeserialize: deserialize_rover_auth_v1_ListUsersResponse,
  },
  //
  // A user session is simple sign on using email & password based authentication to generate a new session token
  createUserSession: {
    path: '/rover.auth.v1.Auth/CreateUserSession',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.CreateUserSessionRequest,
    responseType: auth_v1_auth_pb.UserSession,
    requestSerialize: serialize_rover_auth_v1_CreateUserSessionRequest,
    requestDeserialize: deserialize_rover_auth_v1_CreateUserSessionRequest,
    responseSerialize: serialize_rover_auth_v1_UserSession,
    responseDeserialize: deserialize_rover_auth_v1_UserSession,
  },
  //
  // Checks whether the supplied token/user_session is valid
  authenticateToken: {
    path: '/rover.auth.v1.Auth/AuthenticateToken',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.AuthenticateRequest,
    responseType: auth_v1_auth_pb.AuthContext,
    requestSerialize: serialize_rover_auth_v1_AuthenticateRequest,
    requestDeserialize: deserialize_rover_auth_v1_AuthenticateRequest,
    responseSerialize: serialize_rover_auth_v1_AuthContext,
    responseDeserialize: deserialize_rover_auth_v1_AuthContext,
  },
  authenticateUserSession: {
    path: '/rover.auth.v1.Auth/AuthenticateUserSession',
    requestStream: false,
    responseStream: false,
    requestType: auth_v1_auth_pb.AuthenticateRequest,
    responseType: auth_v1_auth_pb.AuthContext,
    requestSerialize: serialize_rover_auth_v1_AuthenticateRequest,
    requestDeserialize: deserialize_rover_auth_v1_AuthenticateRequest,
    responseSerialize: serialize_rover_auth_v1_AuthContext,
    responseDeserialize: deserialize_rover_auth_v1_AuthContext,
  },
};

exports.AuthClient = grpc.makeGenericClientConstructor(AuthService);
