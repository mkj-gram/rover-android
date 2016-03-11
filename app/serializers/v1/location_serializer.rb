module V1::LocationSerializer
    class << self
        def serialize(location_configuration, extra_attributes = {})
            {
                "type" => "locations",
                "id" => location_configuration.id.to_s,
                "attributes" => {
                    "name" => location_configuration.title,
                    "address" => location_configuration.address,
                    "city" => location_configuration.city,
                    "province" => location_configuration.province,
                    "country" => location_configuration.country,
                    "postal-code" => location_configuration.postal_code,
                    "latitude" => location_configuration.latitude,
                    "longitude" => location_configuration.longitude,
                    "radius" => location_configuration.radius,
                    "tags" => location_configuration.tags,
                    "enabled" => location_configuration.enabled,
                    "shared" => location_configuration.shared,
                    "configurations-count" => location_configuration.beacon_configurations_count
                }
            }
        end
    end
end
