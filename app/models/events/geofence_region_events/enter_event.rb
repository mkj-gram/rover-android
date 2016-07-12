module Events
    module GeofenceRegionEvents
        class EnterEvent < GeofenceRegionEvent

            def self.event_id
                Events::Constants::GEOFENCE_REGION_ENTER_EVENT_ID
            end

            Events::Pipeline.register("geofence-region", "enter", self, { targetable: true })


            before_save :set_device_location

            def set_device_location
                if longitude && latitude
                    device.location = Snapshots::Location.new(longitude: longitude, latitude: latitude, accuracy: radius)
                end
            end

        end
    end
end
