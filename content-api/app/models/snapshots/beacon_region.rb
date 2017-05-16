module Snapshots
	class BeaconRegion
		include Virtus.model

		attribute :uuid, String
		attribute :major_number, Integer
		attribute :minor_number, Integer

		def to_doc
			{
				uuid: uuid,
				major_number: major_number,
				minor_number: minor_number
			}
		end

		def ==(other)
			return false if other.nil?
			(
				uuid == other.uuid &&
				major_number == other.major_number &&
				minor_number == other.minor_number
			)
		end
	end
end