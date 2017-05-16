module ModelBroadcaster
	module Document
		extend ActiveSupport::Concern

		included do
			after_save :broadcast_save
			after_destroy :broadcast_destroy
		end

private
		def broadcast_save
			broadcast = ModelBroadcaster::Broadcast.new(:update, self)
			broadcast.broadcast
		end

		def broadcast_destroy
			broadcast = ModelBroadcaster::Broadcast.new(:destroy, self)
			broadcast.broadcast
		end
	end
end