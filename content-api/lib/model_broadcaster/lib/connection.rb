# holds the connection to the rabbitmq server 
module ModelBroadcaster
	class Connection
		attr_reader :connection, :channel
		def initialize(opt)
			@connection = Bunny.new(opt)
			@connection.start
			@channel = @connection.create_channel
		end
	end
end