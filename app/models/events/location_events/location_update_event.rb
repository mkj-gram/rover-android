class LocationUpdateEvent < LocationEvent

    def save
        # silent save if error?
    end

    def json_response
        json = super
        # check to see if there is any beacons in the location
        # grab the closests locations
        json[:included] = ibeacon_wildcard_regions.map(&:serialize)
        json[:included] += closest_geofence_regions(region_limit - ibeacon_wildcard_regions.size).map(&:serialize)
        return json
    end


end
