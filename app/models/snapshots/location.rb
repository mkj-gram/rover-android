module Snapshots
	class Location
		include Virtus.model

		attribute :latitude, Float
		attribute :longitude, Float
		attribute :accuracy, Integer



		def to_doc
			{
				latitude: latitude,
				longitude: longitude,
				accuracy: accuracy
			}.compact
		end

	end
end