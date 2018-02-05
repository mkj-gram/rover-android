# Generated by the protocol buffer compiler.  DO NOT EDIT!
# Source: auth/v1/auth.proto for package 'rover.auth.v1'

require 'grpc'
require 'auth/v1/auth_pb'

module Rover
  module Auth
    module V1
      module Auth
        #
        # # Auth
        #
        # Auth is responsible for authenticating and authorizing all api requests coming
        # in. The Auth service resides within a trusted network and assumes strusted clients.
        #
        # +----------------+         +------------------+
        # |                |         |                  |
        # |                |         |                  |
        # |    Auth Svc    |         |    Beacon Svc    |
        # |                |         |                  |
        # |                |         |                  |
        # +----^-----------+         +---------^--------+
        # |        3                  5   |
        # +----------+           +--------+
        # 2      |     4    |     
        # +------------------+
        # |                  |
        # |                  |
        # |   GraphQL gateway|
        # |                  |
        # |                  |
        # +--------^---------+
        # |
        # |
        # 1 |  6
        # |
        # |
        # +---------------+
        # |               |
        # |   an api/web  |
        # |    client     |
        # +---------------+
        #
        #
        # 0. A client wants to delete a beacon with id=1 account_id=1
        # 1. The client reaches the gateway with a session Cookie or a `Authentication: Bearer <token>` header
        # 2. GraphQL takes the the session/token key and authenticates with the auth svc
        # 2.1 if no associated token/session info found - auth service returns an error which graphql propagates back to the client
        # 3. if there's an associated info then auth svc returns it account_id=1 user_id=1 scopes=[web,admin:ibeacon]
        # 4. the gateway given the scopes decides whether a client has enough privileges to call the becaons service and 
        # 4.1. in case of insufficient privileges the error is returned
        # 5. otherwise the graphql delegates the deletion to the beacon service
        # 6. the success is propagaged all the way to the client
        #
        # ## Use Cases
        #
        # ### Customer SDK access
        #
        # As a mobile app user wich has the SDK installed in an app of our Customer
        # I want the SDK to be able to access rover APIs
        # So in order to do it I need an account token with SDK scope
        #
        # ### Server access
        #
        # As a customer I want to be able to make api calls so I need a server token
        #
        # ### Web Analytics 
        #
        # As a web viewer when i browse a web experience I want the analytics code to be able to push events to API
        # using a token with restricted permissions(so nothing else is comprimised)
        #
        # ### User sessions at the Rover.io
        #
        # As a rover.io user i want to be able to login to rover.io through the login page
        # I'll have to re-login after some time (configurabel) time of inactivity.
        #
        # Sessions track a single user sign-on session. This is used to keep track of
        # things like when was the user last seen & what ip was used last. Sessions also
        # auto expire after 24 hours ( configurable ). Once a session has expired the
        # token is no longer valid and the user should be signed out of the front end.
        # However a session is prolonged as long as the user accesses any of the front
        # end apps. An example would be if the session has 10 mins remaining and a user
        # accesses the messages app which calls the messages api. The session will now be
        # extended for another 24 hours
        #
        #
        #
        #
        # Service for authentication of Users and Accounts
        # as well as ACL for the resource access
        #
        class Service

          include GRPC::GenericService

          self.marshal_class_method = :encode
          self.unmarshal_class_method = :decode
          self.service_name = 'rover.auth.v1.Auth'

          #
          # Basic CRUD operations for Accounts
          rpc :GetAccount, GetAccountRequest, Account
          rpc :CreateAccount, CreateAccountRequest, Account
          rpc :UpdateAccount, UpdateAccountRequest, Account
          rpc :ListTokens, ListTokensRequest, ListTokensResponse
          #
          # Basic CRUD operations for Users
          rpc :GetUser, GetUserRequest, User
          rpc :CreateUser, CreateUserRequest, User
          rpc :UpdateUser, UpdateUserRequest, User
          rpc :UpdateUserPassword, UpdateUserPasswordRequest, Empty
          rpc :GetUserInfo, GetUserInfoRequest, GetUserInfoResponse
          #
          # A user session is simple sign on using email & password based authentication to generate a new session token
          rpc :CreateUserSession, CreateUserSessionRequest, UserSession
          #
          # Checks whether the supplied token/user_session is valid
          rpc :AuthenticateToken, AuthenticateRequest, AuthContext
          rpc :AuthenticateUserSession, AuthenticateRequest, AuthContext
        end

        Stub = Service.rpc_stub_class
      end
    end
  end
end
