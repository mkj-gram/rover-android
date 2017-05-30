# Auth Node Client

### Calling rpc calls

`@rover/auth-client` automatically bundles in `@rover/apis` which holds all gRPC definitions. To start making rpc calls with the Auth Client you must first contruct the message from `@rover/apis` and then call the appropiate function. For a full list of avaliable rpc calls visit https://github.com/RoverPlatform/rover/blob/master/protos/auth/v1/auth.proto

```javascript
var RoverApis = require("@rover/apis")
var Auth = require("@rover/auth-client")

var AuthClient = Auth.Client()

/* Build the request */
var request = new RoverApis.auth.v1.AuthenticateRequest()
request.setKey("token123")

AuthClient.authenticateToken(request, function(err, AuthContext) {
  if (err) {
    /* 
      Do something with the error. You can use @rover-common/grpc-codes to convert grpc errors to http
    */
  }
  
  /* 
    AuthContext = {
      accountId: 1,
      userId: 3,
      permissionScopes: ["sdk", "server"]
    }
  */
})

```

### Using the Middleware

A default Middleware is provided out of the box that will automatically attempt to authenticate requests. If authentication was successful the middleware injects an AuthContext into the request. Below is an example of what the AuthContext looks like

##### Setup

```javascript
var express = require("express")
var app = express()

const Auth = require("@rover/auth-client")

/* Generates a default client */
const AuthClient = Auth.Client()

/* Generates auth middleware with provided AuthCient */
const AuthMiddleware = Auth.Middleware(AuthClient)

/* Apply Middleware to entire app */
app.use(AuthMiddleware)

/* Apply Middleware to specific endpoint */
app.use('/graphql', cors(), AuthMiddleware, graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: {
    	authContext: req.authContext
    }
})))
```
##### Request AuthContext

```javascript
app.get('/users', AuthMiddleware, (req, res) => {
	/* If we were successfuly authenticated */
	req.authContext = {
		account_id: 1,
		user_id: 3, // can be undefined
		scopes: ["sdk", "web", "server", "admin"]
	}

	/* else */
	req.authContext = undefined
})
```

