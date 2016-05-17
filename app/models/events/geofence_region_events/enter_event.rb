module Events
    module GeofenceRegionEvents

        class EnterEvent < GeofenceRegionEvent

            def self.event_id
                Events::Constants::GEOFENCE_REGION_ENTER_EVENT_ID
            end

            Events::Pipeline.register("geofence-region", "enter", self, { targetable: true })

        end

    end
end
