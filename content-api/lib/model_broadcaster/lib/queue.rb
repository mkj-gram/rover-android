module ModelBroadcaster
	class Queue
		attr_reader :queue
		def initialize(connection, name, opts = {})
			@queue = connection.channel.queue(name, opts)
		end

		def bind(exchange, opts = {})
			@queue.bind(exchange, opts)
		end

	end
end