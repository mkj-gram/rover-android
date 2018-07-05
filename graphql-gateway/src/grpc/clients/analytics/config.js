module.exports = {
    host:
        process.env.ANALYTICS_SERVICE_SERVICE_HOST ||
        process.env.ANALYTICS_V1_SERVICE_HOST ||
        'localhost',
    port:
        process.env.ANALYTICS_SERVICE_SERVICE_PORT ||
        process.env.ANALYTICS_V1_SERVICE_PORT ||
        5100
}
