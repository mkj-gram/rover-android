const RoverApis = require('@rover/apis')
const Client = RoverApis.analytics.Services.AnalyticsClient
const grpc = require('grpc')
const promisify = require('@rover-common/grpc-promisify')

const client = function(opts) {
    if (opts === undefined) {
        opts = {}
    }

    const connection = process.env.ANALYTICS_SERVICE_DSN

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
