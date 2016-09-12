module Events
    module LocationEvents

        class UpdateEvent < LocationEvent

            def self.event_id
                Events::Constants::LOCATION_UPDATE_EVENT_ID
            end

            Events::Pipeline.register("location", "update", self, { targetable: true })

            before_save :set_device_location
            before_save :set_beacon_regions_monitoring
            before_save :set_geofence_regions_monitoring
            

            def set_beacon_regions_monitoring
                return true if device.gimbal_mode == true

                if device.beacon_regions_monitoring_updated_at.nil? || account.beacon_configurations_updated_at > device.beacon_regions_monitoring_updated_at
                    ibeacon_regions = ibeacon_wildcard_regions
                    beacon_regions = ibeacon_regions.map { |ibeacon| Snapshots::BeaconRegion.new(uuid: ibeacon.uuid, major_number: ibeacon.major, minor_number: ibeacon.minor) }
                    device.beacon_regions_monitoring = beacon_regions
                    device.beacon_regions_monitoring_updated_at = Time.zone.now
                end
            end

            def set_geofence_regions_monitoring
                return true if device.gimbal_mode == true
                # how do we determine if we should query for more fences?
                # simple case small amount of geofences
                limit = region_limit - device.beacon_regions_monitoring.size
                puts limit
                should_reload_geofences = false

                if account.places_count <= limit
                    puts 'WITHIN LIMIT'
                    # simple case for when all geofence regions
                    if (device.geofence_regions_monitoring_updated_at.nil? || account.places_updated_at > device.geofence_regions_monitoring_updated_at)
                        should_reload_geofences = true
                    end
                elsif needs_update
                    should_reload_geofences = true
                end


                if should_reload_geofences
                    geofence_regions = closest_geofence_regions(region_limit - device.beacon_regions_monitoring.size)
                    geofence_snapshots = geofence_regions.map { |geofence| Snapshots::GeofenceRegion.new(latitude: geofence.latitude, longitude: geofence.longitude, radius: geofence.radius)}
                    device.geofence_regions_monitoring = geofence_snapshots
                    device.geofence_regions_monitoring_updated_at = Time.zone.now
                end
            end


            def to_json
                json = super
                json[:included] += device.beacon_regions_monitoring.map { |snapshot| IBeaconRegion.new(uuid: snapshot.uuid, major: snapshot.major_number, minor: snapshot.minor_number)}.map(&:serialize)
                json[:included] += device.geofence_regions_monitoring.map { |snapshot| GeofenceRegion.new(latitude: snapshot.latitude, longitude: snapshot.longitude, radius: snapshot.radius)}.map(&:serialize)
                return json
            end


            private

            def needs_update
                @needs_update ||= device && device.location_updated?
            end

        end

    end
end
