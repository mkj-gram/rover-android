const RoverApis = require('@rover/apis')
const Client = RoverApis.analytics.Services.AnalyticsClient
const grpc = require('grpc')
const Config = require('./config')
const promisify = require('@rover-common/grpc-promisify')

const client = function(opts) {
    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.host
    const port = opts.port || Config.port

    const connection = `${host}:${port}`

    console.info('Analytics new Client: ' + connection)

    const client = new Client(connection, grpc.credentials.createInsecure())

    promisify(client)
    return client
}

module.exports = {
    v1: {
        Client: client
    }
}
