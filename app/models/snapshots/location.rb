module Snapshots
	class Location
		include Virtus.model

		attribute :latitude, Float
		attribute :longitude, Float
		attribute :accuracy, Integer
		attribute :timestamp, Time, default: Time.zone.now # the timestamp of when the snapshot was taken


		def to_doc
			{
				latitude: latitude,
				longitude: longitude,
				accuracy: accuracy,
				timestamp: timestamp
			}.compact
		end

	end
end