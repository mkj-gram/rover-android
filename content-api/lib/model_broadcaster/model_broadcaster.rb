require 'bunny'
require 'lib/connection'
require 'lib/document'
require 'lib/broadcast'
require 'lib/queue'
require 'lib/direct_exchange'
require 'lib/helpers/configuration'

module ModelBroadcaster
	extend Configuration

		define_setting :connection_options, {}
		define_setting :exchange_name, "modelbroadcaster"
		define_setting :exchange_options, {durable: true, auto_delete: false}
		define_setting :queue_name, "default.queue"
		define_setting :queue_options, {durable: true, auto_delete: false}

		class << self

			def bind_queue
				queue.bind(exchange.name)
			end
			def exchange
				@@direct_exchange ||= ModelBroadcaster::DirectExchange.new(connection, ModelBroadcaster.exchange_name, ModelBroadcaster.exchange_options)
			end
			def queue
				@@queue ||= ModelBroadcaster::Queue.new(connection, ModelBroadcaster.queue_name, ModelBroadcaster.queue_options)
			end

			def connection
				@@connection ||= ModelBroadcaster::Connection.new(ModelBroadcaster.connection_options)
			end
		end
	
end