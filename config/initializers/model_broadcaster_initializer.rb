ModelBroadcaster.configure do |config|
	config.connection_options = {
		user: "railsapi",
		password: "password"
	}
	config.exchange_options = {
		durable: true,
		auto_delete: false
	}
	
	config.queue_name = "replicator_queue"
	
end