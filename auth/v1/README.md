# Auth

Auth is responsible for authenticating and authorizing all api requests coming in. The Auth service sits behind the gateway layer



## Use Cases

### Accounts
Accounts represent an organization that is paying to use Rover. Every model created is in someway associated to an Account. For example the company Acme Corporation will have 1 Rover account and multiple users.

The service must have the ability to create, retrieve and modify account information. The following list describes the type of information needed to be tracked

- id
- name
- number of users
- created_at
- updated_at

### Users

Users are a user of the Account. An example would be foo@acme.com who belongs to the Acme Corporation. Users exclusively deal with the front-end web apps only. The service must be able to create, update, and destroy users.

- id
- account_id
- name
- email
- password_digest ( don't store password as plain text )
- created_at
- updated_at

### Password Reset

The service must allow for users to send themselves a password reset link. Each password reset link is unique and can be used at most 1 time to reset the password. The link also has an expiry time of 24 hours ( configurable ) 

### Sessions

Sessions track a single users sign on session. This is used to keep track of things like when was the user last seen & what ip was used last. Sessions also auto expire after 24 hours ( configurable ). Once a session has expired the token is no longer valid and the user should be signed out of the front end. However a session is prolonged as long as the user accesses any of the front end apps. An example would be if the session has 10 mins remaining and a user accesses the messages app which calls the messages api. The session will now be extended for another 24 hours

### Scopes
Scopes describe the high level access a token has. This access is mostly resourced based. i.e the token "abc" has access to create events / read inbox / load experiences 


### Gateway Clients

The gateways must have a way to take a token from the request header and authenticate it. They need the following information once the request is authenticated: the Account and or User. Once the gateways know who is accessing the api they then need to have the ability to ask if the current Account or User have access to a particular resource. In the Rest Gateway each route will describe the resources it is trying to access. It will then ask the Auth service if its allowed to make the grpc calls to the backend servers. The Graphql Gateway will follow the same design as the Rest Gateway. For each query type it will have an associated resource. The service must be able to handle a single resource authorization lookup or multiple in one call
