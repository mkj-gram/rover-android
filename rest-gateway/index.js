const http = require('http')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const grpcCodes = require("@rover-common/grpc-codes")
const cors = require('cors')
const Config = require('./config')
const Raven = require('raven')
/* Setup Auth Client and Middleware */
const Auth = require('@rover/auth-client')
const AuthClient = Auth.v1.Client()
const AuthMiddleware = Auth.v1.Middleware(AuthClient)

/* Setup Express Server */
const app = express()

if (Config.get('/raven/enabled')) {
    Raven.config(Config.get('/raven/dsn')).install();
    app.use(Raven.requestHandler());
    app.use(Raven.errorHandler());
}
app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json({ type: ['application/json', 'application/vnd.api+json'] }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(AuthMiddleware)
app.disable('x-powered-by');

/* Load Controllers */

const staticSegmentController = require('./routes/static-segments')

app.use('/v1/static-segments', staticSegmentController)

/* Add healthcheck endpoint for kubernetes */
app.get('/healthcheck', function(req, res) {
    res.writeHead(200)
    return res.end()
})

/* Catch all requests we can't support and return 404 */
app.use(function(req, res, next) {
    const err = new Error("Not Found")
    err.status = 404
    return next(err)
})


/* Error Handling */
app.use(function(err, req, res, next) {
    // if an error has a code it most likely a grpc error code
    
    if (err && err.code) {
        err.status = grpcCodes.grpcToHttp(err.code)
    }

    console.error(err)

    // render the error page
    res.status(err.status || 500)
    return res.end()
})

/* Server Boot */

function normalizePort() {

    let port = parseInt(Config.get('/port'))

    if (isNaN(port)) {
        return 3000
    }

    return port
}

const port = normalizePort()

app.listen(port, function () {
    console.log('Rest-Gateway listening on port: ' + port)
})