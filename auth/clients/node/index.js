const RoverApis = require("@rover/apis")
const V1Models = RoverApis.auth.v1.Models
const Client = RoverApis.auth.v1.Services.AuthClient
const grpc = require('grpc')
const Config = require('./config')
const IPParse = require("@rover-common/ip-parse")
const jwtDecode = require('jwt-decode')

const newClient = function(opts) {

    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.get('/auth_service/host')
    const port = opts.port || Config.get('/auth_service/port')

    const connection = `${host}:${port}`

    console.info("Auth new Client: " + connection)

    return new Client(connection, grpc.credentials.createInsecure())
}


const Middleware = function(client, opts = {}) {
   return function (req, res, next) {

        const headers = req.headers

        const ip = IPParse(headers['x-real-ip'])

        const request = new V1Models.AuthenticateRequest()

        request.setLastSeenIp(ip)

        const getError = function(err) {
            return (err) ? new Error(err.message) : null
        }
        
        /*
            return function since authenticateToken and authenticateUserSession have the same response
         */
        const returnContext = function(err, AuthContext) {
            req.auth = {
                context: AuthContext,
                error: getError(err)
            }

            req._authContext = AuthContext
            return next()
        }

        /*
            Choose which method to authenticate with based on header values
         */
        if (headers.hasOwnProperty('x-rover-api-key')) {
            request.setKey(headers['x-rover-api-key'])
            client.authenticateToken(request, returnContext)
        } else if (headers.hasOwnProperty('authorization')) {
            const key = headers['authorization'].split(' ')[1]
            let jwt = {}

            try {
                jwt = jwtDecode(key)
            } catch(e) {
                return returnContext(e, null)
            }

            if (jwt.jti) {
                request.setKey(jwt.jti)
                return client.authenticateUserSession(request, returnContext)
            } else {
                return returnContext({message: 'JWT token is missing jti'}, null)
            }
        } else {
            return returnContext({message: 'Unable to determine authentication type'}, null)
        }
    }
}


module.exports = {
    v1: {
        Client: newClient,
        Middleware: Middleware
    }
}