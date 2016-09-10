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

		def ==(other)
			return false if other.nil?
			return false if !other.is_a?(Snapshots::Location)
			return ( self.latitude == other.latitude && self.longitude == other.longitude && self.accuracy == other.accuracy )
		end

		def to_geo_point
			@geo_point ||= ::GeoPoint.new(latitude: self.latitude, longitude: self.longitude)
		end

		def distance_between(other)
			return 0 if other.nil?
			return 0 if !other.is_a(Snapshots::Location)
			return GeoPoint.distance_between(self.to_geo_point, other.to_geo_point)
		end

	end
end