module Events
    module LocationEvents

        class UpdateEvent < LocationEvent

            def self.event_id
                Events::Constants::LOCATION_UPDATE_EVENT_ID
            end

            Events::Pipeline.register("location", "update", self, { targetable: true })

            def to_json
                json = super
                json[:included] += ibeacon_wildcard_regions.map(&:serialize)
                json[:included] += closest_geofence_regions(region_limit - ibeacon_wildcard_regions.size).map(&:serialize)
                return json
            end
        end

    end
end
