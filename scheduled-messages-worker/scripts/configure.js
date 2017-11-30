const amqp = require('amqplib')
const config = require('../config')

let channel = null

amqp.connect(config.get('/amqp/url'))
	.then(connection => connection.createChannel())
	.then(c => channel = c)
	.then(_ => channel.assertExchange('background_jobs'))
	.then(_ => channel.assertExchange('delayed_exchange', 'x-delayed-message', { 
		arguments: {
			'x-delayed-type': 'direct'
		}
	}))
	.then(_ => {
		console.log("Success!!! RabbitMQ Exchanges configured\n")
		process.exit(0)
	})
	.catch(err => {
		console.error("ERROR: ", err)
		process.exit(1)
	})