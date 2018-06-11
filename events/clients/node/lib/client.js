const Wait          = require('./wait')
const Kafka         = require('node-rdkafka')
const Serializer    = require('./serializer')
const AuthContext   = require('@rover/apis').auth.v1.Models.AuthContext
const uuid          = require('uuid/v1');


var Client = function(config) {
	let c = config || {}

	let kafkaDefaultConfig = {
		'metadata.broker.list': 'kafka:9092',
		'compression.codec': 'snappy',
		'retry.backoff.ms': 100,
		'message.send.max.retries': 3,
		'socket.keepalive.enable': true,
		'queue.buffering.max.messages': 50000, // Maximum messages we can buffer in memory before rejecting
		'queue.buffering.max.ms': 250,         // How often we should flush the internal buffer
		'batch.num.messages': 10000,           // How many messages we send to kafka on each flush
	}

	this._topic = c.topic || "events"
	// Allow for overiding of any of the defaults
	const kafkaConfig = Object.assign(kafkaDefaultConfig, c.kafka, { 'dr_cb': true })
	this._producer = new Kafka.Producer(kafkaConfig, { 'request.required.acks': -1 });
	
	this._waiter = new Wait()
}

Client.prototype.connect = function() {
	return new Promise((resolve, reject) => {
		let producer = this._producer
		let waiter   = this._waiter
		producer.connect(null, function(err, data) {
			if (err) {
				return reject(err)
			}

			producer.setPollInterval(50)
			producer.on('delivery-report', function(err, report) {
				let key = report.opaque
				waiter.notify(key, err)
			})

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
 * Submit an event to the pipeline's kafka input topic
 * @param  {AuthContext} auth        
 * @param  {String} key 	the key to use while selecting a kafka partition
 * @param  {Object} event            
 * @return {Promise}                 
 */
Client.prototype.submit = function(auth, key, event) {
	return this.submitBatch([{ auth: auth, key: key, event: event }])
}


/**
 * Submit a batch of events to the pipeline's kafka input topic. Only returning when all succesfully publish 
 * or an individial message fails
 * @param  {AuthContext} auth        
 * @param  {String} key 	the key to use while selecting a kafka partition
 * @param  {Object} event            
 * @return {Promise}                 
 */
Client.prototype.submitBatch = function(batch) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(batch)) {
			return reject(new Error("batch must be an array"))
		}

		const producer = this._producer
		const waiter   = this._waiter

		if (!producer.isConnected()) {
			return reject(new Error("client is not connected: please call connect() before calling submit()"))
		}

		let group = []

		for (let i = 0; i < batch.length; i++) {
			let { auth, key, event } = batch[i]

			if (auth === null || auth === undefined ||  !(auth instanceof AuthContext)) {
				return reject(new TypeError("auth is not defined or of type AuthContext"))
			}

			if (key === null || key === undefined || key === "") {
				return reject(new TypeError("partition key cannot be empty"))
			}

			const payload = Serializer.serializeEvent(event)
			payload.setAuthContext(auth)
			
			try {
				let waitKey = uuid()
				producer.produce(
					this._topic,
					null, // defaults to consistent random for keyed messages
					new Buffer(payload.serializeBinary()),
					key,
					Date.now(),
					waitKey
				)
				group.push(waitKey)
			} catch(err) {
				return reject(err)
			}
		}
		
		Promise.all(group.map(function(key) {
			return new Promise((resolve, reject) => {
				waiter.on(key, function(err) {
					if (err) {
						return reject(err)
					}
					return resolve()
				})
			})
		})).catch(err => reject(err))
		.then(_ => resolve())
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
