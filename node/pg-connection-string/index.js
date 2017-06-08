const URL = require('url')
const QUERYSTRING = require('querystring')
const fs = require('fs')

const enabledSSLModes = ['allow', 'prefer', 'require', 'verify-ca', 'verify-full']

function isEmpty(obj) {
    return Object.keys(obj).length == 0
}

function parse(connection) {

    if (connection == undefined || connection == null) {
        return {}
    }

    let url = URL.parse(connection)

    if (url.protocol != 'postgres:') {
        throw new TypeError("protocol must be postgres but got: " + url.protocol)
    }

    let parsedConnection = {}

    if (url.host) {
        let parts = url.host.split(":")
        let hostname = parts[0]
        parsedConnection.host = hostname
    }

    if (url.port) {
        parsedConnection.port = parseInt(url.port)
    }

    if (url.auth) {
        let auth = url.auth.split(":")
        let user = auth[0]
        let password = auth[1]

        parsedConnection.user = user
        parsedConnection.password = password
    }

    if (url.pathname) {
        let dbname = url.pathname.substring(1)
        parsedConnection.database = dbname
    }


    if (url.query) {
        let query = QUERYSTRING.parse(url.query)

        /*
            https://www.postgresql.org/docs/9.6/static/libpq-connect.html
            Default is prefer
         */
        
        let sslmode = query.sslmode || 'prefer'

        let shouldEnableSSL = enabledSSLModes.includes(sslmode)

        if (shouldEnableSSL || query.sslrootcert || query.sslkey || query.sslcert) {
            
            let sslConnection = {}

            if (query.sslrootcert) {
                sslConnection.ca = fs.readFileSync(query.sslrootcert)
            }

            if (query.sslkey) {
                sslConnection.key = fs.readFileSync(query.sslkey)
            }

            if (query.sslcert) {
                sslConnection.cert = fs.readFileSync(query.sslcert)
            }

            if (isEmpty(sslConnection)) {
                parsedConnection.ssl = true
            } else {
                parsedConnection.ssl = sslConnection
            }
        } else {
            parsedConnection.ssl = false
        }
    }

    return parsedConnection
}


module.exports = parse