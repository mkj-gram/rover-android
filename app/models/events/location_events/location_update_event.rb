class LocationUpdateEvent < LocationEvent

    def save
        # silent save if error?
        add_to_included(ibeacon_wildcard_regions.map(&:serialize))
        add_to_included(closest_geofence_regions(region_limit - ibeacon_wildcard_regions.size).map(&:serialize))
        super
    end

end
