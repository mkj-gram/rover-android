const Kafka = require('node-rdkafka')

var Client = function(config) {
	let c = config || {}

	let kafkaDefaultConfig = {
		'group.id': 'test-consumer',
		'metadata.broker.list': 'kafka:9092',
		'compression.codec': 'snappy',
		'retry.backoff.ms': 10,
		'auto.offset.reset': 'latest',
	}

	this._topic = undefined
	// Allow for overiding of any of the defaults
	this._consumer = new Kafka.KafkaConsumer(Object.assign(kafkaDefaultConfig, c.kafka));
	this._consumer.setDefaultConsumeTimeout(10000);
	this._consumer.on('event.log', function(msg) {
		// console.info(msg)
	})
}

Client.prototype.connect = function() {
	return new Promise((resolve, reject) => {
		let consumer = this._consumer
		consumer.connect(null, function(err, data) {
			if (err) {
				return reject(err)
			}
			return resolve()
		})
	})
}

Client.prototype.disconnect = function() {
	return new Promise((resolve, reject) => {
		let consumer = this._consumer

		return consumer.disconnect(function(err) {
			if (err) {
				return reject(err)
			}
			
			return resolve()
		})
	})
}

Client.prototype.subscribe = function(topic) {
	this._topic = topic
	let consumer = this._consumer
	consumer.subscribe([this._topic])
}


Client.prototype.seekLast = function(n) {
	return new Promise((res, rej) => {
		
		if (n === undefined || n === null) {
			n = 1
		}

		const consumer = this._consumer
		const topic = this._topic

		consumer.getMetadata({ topic: topic, metadataOptions: { timeout: 1000 }}, function(err, data) {
			if (err) {
				return rej(err)
			}

			const meta = data.topics.find(t => t.name == topic)
			if (meta === undefined) {
				return rej(new Error("Topic: " + topic + " does not exist"))
			}

			const partitionCount = meta.partitions.length

			let queries = []
			for (var i = 0; i < partitionCount; i++) {
				const partition = i
				queries.push(new Promise((resolve,reject) => {
					consumer.queryWatermarkOffsets(topic, partition, 50, function(err, offsets) {
						if (err) {
							return reject(err)
						}

						return resolve({
							topic: topic,
							partition: partition,
							high: offsets.highOffset,
							low: offsets.lowOffset
						})
					})
				}))
			}

			Promise.all(queries)
				.then(topicMetas => {
					let seeks = []
					topicMetas.forEach(topicMeta => {
						if (topicMeta.high === 0) {
							// If there isn't anything in the topic don't waste time seeking
							return
						}

						seeks.push(new Promise((resolve, reject) => {
							consumer.seek({ topic: topicMeta.topic, partition: topicMeta.partition, offset: Math.max(topicMeta.high - n, 0) }, 50, function(err) {
								if (err) {
									return reject(err)
								}

								return resolve()
							})
						}))
					})

					Promise.all(seeks).then(s => {
						return res()
					}).catch(err => {
						return rej(err)
					})
				})
				.catch(err => {
					return rej(err)
				})
				
		})
	})
}

Client.prototype.next = function() {
	return new Promise((resolve, reject) => {
		let consumer = this._consumer

		consumer.consume(1, function(err, message) {
			if (err) {
				return reject(err)
			}

			return resolve(message)
		})
	})
}

module.exports = Client