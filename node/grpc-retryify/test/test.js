const assert = require('sinon').assert
const expect = require('chai').expect
const sinon = require('sinon')
const retry = require('../index.js')

describe('retryify', function() {
		
	function makeClient() {
		function Client() {}
		Client.prototype.test = function(req, cb) { return cb(req) }

		return new Client()
	}

	it('wraps all prototype functions', function() {
		let spy = sinon.spy()

		let client = makeClient()
		retry(client)

		client.test("request", spy)

		assert.calledOnce(spy)

	})

	it('preserves calling arguments', function() {
		let spy = sinon.spy()

		let client = makeClient()
		retry(client)

		client.test("request", spy)

		assert.calledWith(spy, "request")
	})

	it('returns success after 3 failed attempts', function(done) {
		let client = makeClient()
		let stub = sinon.stub(client, 'test')
		retry(client)
		

		// First call returns a grpc error
		stub.onCall(0).callsFake(function(req, opts, cb) {
			return cb({ code: 2 })
		})

		// Second call returns a grpc error
		stub.onCall(1).callsFake(function(req, opts, cb) {
			return cb({ code: 2 })
		})

		stub.onCall(2).callsFake(function(req, opts, cb) {
			return cb(null, "a")
		})

		client.test("a", { retry: { factor: 1, minTimeout: 10 }}, function(err, response) {
			expect(err).to.be.null
			expect(response).to.equal("a")
			done()
		})

	}).timeout(5000)

	it('aborts early when the error is non retryable', function(done) {
		let client = makeClient()
		let stub = sinon.stub(client, 'test')
		retry(client)
		

		// First call returns a grpc error
		stub.onCall(0).callsFake(function(req, cb) {
			return cb(new Error("Blow Up!"))
		})

		// Second call returns a grpc error
		stub.onCall(1).callsFake(function(req, cb) {
			return cb({ code: 2 })
		})

		stub.onCall(2).callsFake(function(req, cb) {
			return cb(null, "a")
		})

		client.test("a", function(err, response) {
			expect(err).to.be.an('error')
			expect(response).to.be.undefined
			assert.calledOnce(stub)
			done()
		})
	})


	it('returns an error when number of operations were exhausted', function(done) {
		let client = makeClient()
		let stub = sinon.stub(client, 'test')
		retry(client)
		

		// First call returns a grpc error
		stub.onCall(0).callsFake(function(req, cb) {
			return cb(new Error("Blow Up!"))
		})

		// Second call returns a grpc error
		stub.onCall(1).callsFake(function(req, cb) {
			return cb({ code: 2 })
		})

		stub.onCall(2).callsFake(function(req, cb) {
			return cb(null, "a")
		})

		client.test("a", function(err, response) {
			expect(err).to.be.an('error')
			expect(response).to.be.undefined
			assert.calledOnce(stub)
			done()
		})
	})

	it('allows overriding of retry checker function', function(done) {
		let client = makeClient()
		let stub = sinon.stub(client, 'test')
		retry(client)
		

		// First call returns a grpc error
		stub.onCall(0).callsFake(function(req, opts, cb) {
			return cb(new Error("Blow Up!"))
		})

		// Second call returns a grpc error
		stub.onCall(1).callsFake(function(req, opts, cb) {
			return cb({ code: 2 })
		})

		stub.onCall(2).callsFake(function(req, opts, cb) {
			return cb(null, "a")
		})

		let retryFunc = sinon.stub().returns(true)

		client.test("a", { retry: { on: retryFunc, minTimeout: 10 } }, function(err, response) {
			expect(err).to.be.null
			expect(response).to.be.equal("a")
			assert.calledTwice(retryFunc)
			done()
		})
	}).timeout(5000)
})