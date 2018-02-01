const RoverApis = require('@rover/apis')
const Client = RoverApis.campaigns.v1.Services.CampaignsClient
const grpc = require('grpc')
const Config = require('./config')

const client = function(opts) {
    if (opts === undefined) {
        opts = {}
    }

    const host = opts.host || Config.host
    const port = opts.port || Config.port

    const connection = `${host}:${port}`

    console.info('Campaigns new Client: ' + connection)

    return new Client(connection, grpc.credentials.createInsecure())
}

module.exports = {
    v1: {
        Client: client
    }
}
