module.exports = {
	host: process.env.AUDIENCE_SERVICE_HOST || process.env.AUDIENCE_V1_SERVICE_HOST || 'localhost',
	port: process.env.AUDIENCE_SERVICE_PORT || process.env.AUDIENCE_V1_SERVICE_PORT || 5100
}