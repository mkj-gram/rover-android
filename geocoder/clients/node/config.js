module.exports = {
	host: process.env.GEOCODER_SERVICE_HOST || process.env.GEOCODER_V1_SERVICE_HOST || 'localhost',
	port: process.env.GEOCODER_SERVICE_PORT || process.env.GEOCODER_V1_SERVICE_PORT || 5100
}