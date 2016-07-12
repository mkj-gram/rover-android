module Events
    module LocationEvents

        class UpdateEvent < LocationEvent

            def self.event_id
                Events::Constants::LOCATION_UPDATE_EVENT_ID
            end

            Events::Pipeline.register("location", "update", self, { targetable: true })


            before_save :set_beacon_regions_monitoring
            before_save :set_geofence_regions_monitoring
            before_save :set_device_location

            def set_beacon_regions_monitoring
                @ibeacon_regions = ibeacon_wildcard_regions
                beacon_regions = @ibeacon_regions.map { |ibeacon| Snapshots::BeaconRegion.new(uuid: ibeacon.uuid, major_number: ibeacon.major, minor_number: ibeacon.minor) }
                device.beacon_regions_monitoring = beacon_regions
            end

            def set_geofence_regions_monitoring
                @geofence_regions = closest_geofence_regions(region_limit - device.beacon_regions_monitoring.size)
                geofence_snapshots = @geofence_regions.map { |geofence| Snapshots::GeofenceRegion.new(latitude: geofence.latitude, longitude: geofence.longitude, radius: geofence.radius)}
                device.geofence_regions_monitoring = geofence_snapshots
            end


            def to_json
                json = super
                json[:included] += @ibeacon_regions.map(&:serialize)
                json[:included] += @geofence_regions.map(&:serialize)
                return json
            end
        end

    end
end
