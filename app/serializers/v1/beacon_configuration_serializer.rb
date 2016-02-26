module V1::BeaconConfigurationSerializer
    class << self
        def serialize(beacon_configuration, extra_attributes = {})
            {
                "type" => "configurations",
                "id" => beacon_configuration.id.to_s,
                "attributes" => {
                    "name" => beacon_configuration.title,
                    "tags" => beacon_configuration.tags,
                    "shared" => beacon_configuration.shared,
                    "enabled" => beacon_configuration.enabled
                }.merge(extra_attributes).merge(beacon_configuration.configuration_attributes)
            }
        end
    end
end
