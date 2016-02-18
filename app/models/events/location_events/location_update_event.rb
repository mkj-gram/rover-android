class LocationUpdateEvent < LocationEvent

    def self.event_id
        Event::LOCATION_UPDATE_EVENT_ID
    end

    def save
        # silent save if error?
        # add_to_included(ibeacon_wildcard_regions.map(&:serialize))
        # add_to_included(closest_geofence_regions(region_limit - ibeacon_wildcard_regions.size).map(&:serialize))
        super
    end

    def to_json
        json = super
        json[:included] += ibeacon_wildcard_regions.map(&:serialize)
        json[:included] += closest_geofence_regions(region_limit - ibeacon_wildcard_regions.size).map(&:serialize)
        return json
    end

end
