module.exports = {
    host:
        process.env.NOTIFICATION_SERVICE_SERVICE_HOST ||
        process.env.NOTIFICATION_V1_SERVICE_HOST ||
        'localhost',
    port:
        process.env.NOTIFICATION_SERVICE_SERVICE_PORT ||
        process.env.NOTIFICATION_V1_SERVICE_PORT ||
        5100
}
