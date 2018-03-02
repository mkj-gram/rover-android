const Kafka         = require('node-rdkafka')
const Serializer    = require('./serializer')
const Constants     = require('./constants')
const AuthContext   = require('@rover/apis').auth.v1.Models.AuthContext


var Client = function(config) {
	let c = config || {}

	let kafkaDefaultConfig = {
		'metadata.broker.list': 'kafka:9092',
		'compression.codec': 'snappy',
		'retry.backoff.ms': 10,
		'message.send.max.retries': 3,
		'request.required.acks': 1,
		'socket.keepalive.enable': true,
		'queue.buffering.max.messages': 50000,
		'queue.buffering.max.ms': 1000,
		'batch.num.messages': 1000,
	}

	this._topic = c.topic || "events"
	// Allow for overiding of any of the defaults
	this._producer = new Kafka.Producer(Object.assign(kafkaDefaultConfig, c.kafka));
}

Client.prototype.connect = function() {
	return new Promise((resolve, reject) => {
		let producer = this._producer
		producer.connect(null, function(err, data) {
			if (err) {
				return reject(err)
			}
			return resolve()
		})
	})
}

Client.prototype.reconnect = function() {
	let self = this

	if (self._reconnecting == true) {
		// We are already trying to reconnect
		return
	}

	self._reconnecting = true

	let producer = this._producer
	if (!producer.isConnected()) {
		self.connect(function(err) {
			self._reconnecting = false
			if (err) {
				console.log(err)
				return self.reconnect()
			}
		})
	}
}

Client.prototype.disconnect = function() {
	return new Promise((resolve, reject) => {
		let producer = this._producer

		return producer.disconnect(function(err) {
			if (err) {
				return reject(err)
			}
			
			return resolve()
		})
	})
}

/**
 * Submit an event to transformer's kafka input topic
 * @param  {AuthContext} auth        
 * @param  {String} identifier
 * @param  {ENUM} <Profile,Device>
 * @param  {Object} event            
 * @return {Promise}                 
 */
Client.prototype.submit = function(auth, identifier, type, event) {
	return new Promise((resolve, reject) => {
		const producer = this._producer
		const key = identifier

		if (!producer.isConnected()) {
			return reject(new Error("client is not connected: please call connect() before calling submit()"))
		}

		if (auth === null || auth === undefined ||  !(auth instanceof AuthContext)) {
			return reject(new TypeError("auth is not defined or of type AuthContext"))
		}

		if (key === null || key === undefined || key === "") {
			return reject(new TypeError("device identifier cannot be empty"))
		}

		if (type !== Constants.PROFILE_EVENT && type !== Constants.DEVICE_EVENT) {
			return reject(new Error("unsupported event type got: " + type))
		}

		
		let payload

		if (type === Constants.DEVICE_EVENT) {
			payload = Serializer.serializeDeviceEvent(auth, event, identifier, event.context)
		} else {
			return reject(new Error("profile event: unimplemented"))
		}
		
		payload.setAuthContext(auth)
		
		try {
			producer.produce(
				this._topic,
				null, // defaults to consistent random for keyed messages
				new Buffer(payload.serializeBinary()),
				key,
				Date.now()
			)
			return resolve()
		} catch(err) {
			return reject(err)
		}
	})
}


/**
 * Flush the internal kafka producer queue
 * this function should be called before disconnecting to ensure all outstanding messages make it to kafka
 * @param  {integer} millisecond timeout               
 * @return {Promise}                 
 */
Client.prototype.flush = function(timeout) {
	return new Promise((resolve, reject) => {
		const producer = this._producer
		timeout = timeout || 60000 // default to 60 second
		producer.flush(timeout, function(err) {
			if (err) {
				return reject(err)
			}
			return resolve()
		})
	})
}

module.exports = Client