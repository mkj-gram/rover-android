const RoverApis = require('@rover/apis')
const grpc = require('grpc')

module.exports = function(GeocoderClient, logger) {
	let methods = {}

	methods.reverseGeocode = function(latitude, longitude, accuracy, callback) {
		const request = new RoverApis.geocoder.v1.Models.ReverseGeocodeRequest()
		
		request.setLatitude(latitude)
		request.setLongitude(longitude)
		request.setAccuracy(accuracy)

		const deadline = Date.now() + 1000

		GeocoderClient.reverseGeocode(request, { deadline: deadline }, function(err, response) {
			if (err) {
				logger.warn("geocoder.reverseGeocode failed to geocode: ", err)
				return callback(err)
			}

			const location = {
				country: 	response.getCountry(),
				state: 		response.getState(),
				city: 		response.getCity()
			}

			return callback(null, location)
		})
	}

	return methods
}