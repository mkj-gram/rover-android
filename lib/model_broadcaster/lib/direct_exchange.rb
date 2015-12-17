module ModelBroadcaster
	class DirectExchange
		attr_reader :exchange

		def initialize(connection, name, opts)
			@exchange = Bunny::Exchange.new(connection.channel, :direct, name, opts)
		end

		def name
			return @exchange.name
		end
		def publish(msg, opts = {})
			# Make sure the queue exits
			ModelBroadcaster.bind_queue
			opts.merge!({content_type: "application/json"})
			@exchange.publish(msg, opts)
		end
	end
end