var expect = require('chai').expect
var request = require('request')
// var BulkGateway = require('../index')
// 

describe('routes', function() {
	describe('v1', function() {
		require('./routes/v1/load-jobs/test')
		require('./routes/v1/segments/test')
	})

	describe('v2', function() {
		require('./routes/v2/profile-imports/test')
	})
})


describe('serializers', function() {
	describe('v1', function() {
		require('./serializers/v1-serializers')
	})
})

describe('modules', function() {
	require('./modules/uploader')
})