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
                    "enabled" => beacon_configuration.enabled,
                    "registered-with-google" => beacon_configuration.registered_with_google,
                    "has-pending-google-updates" => beacon_configuration.has_pending_google_update,
                    "indoor-level" => beacon_configuration.indoor_level
                }.merge(extra_attributes).merge(beacon_configuration.configuration_attributes)
            }
        end
    end
end
