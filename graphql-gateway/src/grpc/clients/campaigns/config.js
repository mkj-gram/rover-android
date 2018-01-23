module.exports = {
    host:
        process.env.CAMPAIGNS_SERVICE_SERVICE_HOST ||
        process.env.CAMPAIGNS_V1_SERVICE_HOST ||
        'localhost',
    port:
        process.env.CAMPAIGNS_SERVICE_SERVICE_PORT ||
        process.env.CAMPAIGNS_V1_SERVICE_PORT ||
        5100
}
