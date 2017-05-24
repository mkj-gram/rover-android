const services = require('./lib/auth/v1/auth_grpc_pb')
const V1Models = require('./lib/auth/v1/auth_pb')
const grpc = require('grpc')
const Config = require('./config')
const IPParse = require("@rover-common/ip-parse")


const newClient = function(opts) {

    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.get('/auth_service/host')
    const port = opts.port || Config.get('/auth_service/port')

    const connection = `${host}:${port}`

    console.info("Auth new Client: " + connection)

    return new services.CsvProcessorClient(connection, grpc.credentials.createInsecure())
}


const Middleware = function(client, opts = {}) {
   return function (req, res, next) {

        const headers = req.headers

        const ip = IPParse(headers['x-real-ip'])

        const request = new V1Models.AuthenticateRequest()

        request.setLastSeenIp(ip)

        var authMethod = null

        if (headers.hasOwnProperty('x-rover-api-key')) {
            request.setKey(headers['x-rover-api-key'])
            authMethod = client.authenticateToken
        } else if (headers.hasOwnProperty('authorization')) {
            const key = headers['authorization'].split(' ')[1]
            request.setKey(key)
            authMethod = client.authenticateUserSession
        } else {
            return next()
        }


        authMethod(request, function(err, AuthContext) {
            if (err) {
                return next(err)
            }

            req.authContext = {
                account_id: AuthContext.getAccountId(),
                user_id: AuthContext.getUserId() || undefined, // user_id of 0 should be treated as missing
                scopes: AuthContext.getPermissionScopesList()
            }

            return next()
        })

    } 
}


module.exports = {
    Auth: {
        V1: {
            Client: newClient,
            Middleware: Middleware, 
            Models: Object.assign( {}, V1Models, require('google-protobuf/google/protobuf/timestamp_pb.js'))
        }
    }
}