module V1::PlaceSerializer
    class << self
        def serialize(place_configuration, extra_attributes = {})
            {
                "type" => "places",
                "id" => place_configuration.id.to_s,
                "attributes" => {
                    "name" => place_configuration.title,
                    "address" => place_configuration.address,
                    "city" => place_configuration.city,
                    "province" => place_configuration.province,
                    "country" => place_configuration.country,
                    "postal-code" => place_configuration.postal_code,
                    "latitude" => place_configuration.latitude,
                    "longitude" => place_configuration.longitude,
                    "radius" => place_configuration.radius,
                    "tags" => place_configuration.tags,
                    "enabled" => place_configuration.enabled,
                    "shared" => place_configuration.shared,
                    "configurations-count" => place_configuration.beacon_configurations_count
                }
            }
        end
    end
end
