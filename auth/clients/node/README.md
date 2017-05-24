# Auth Node Client

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

