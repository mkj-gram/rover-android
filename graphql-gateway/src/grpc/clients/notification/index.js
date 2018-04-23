const RoverApis = require('@rover/apis')
const Client = RoverApis.notification.v1.Services.NotificationClient
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

    console.info('Notification new Client: ' + connection)

    const notificationClient =  new Client(connection, grpc.credentials.createInsecure())
    promisify(notificationClient)

    return notificationClient
}

module.exports = {
    v1: {
        Client: client
    }
}
