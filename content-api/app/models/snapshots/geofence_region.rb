module Snapshots
	class GeofenceRegion
		include Virtus.model

		attribute :longitude, Float
		attribute :latitude, Float
		attribute :radius, Integer

		def to_doc
			{
				longitude: longitude,
				latitude: latitude,
				radius: radius
			}
		end

	end
end