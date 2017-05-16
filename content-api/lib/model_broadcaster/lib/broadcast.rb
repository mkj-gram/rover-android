module ModelBroadcaster
	class Broadcast

		def initialize(cmd, model)
			@cmd = cmd
			@model = model
		end

		def broadcast
			ModelBroadcaster.exchange.publish(dump)
		end

	private

		def dump
			return ({cmd: @cmd, role: @model.class.to_s.downcase}.merge!(@model.attributes)).to_json
		end
		
	end
end