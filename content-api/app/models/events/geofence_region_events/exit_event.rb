module Events
    module GeofenceRegionEvents

        class ExitEvent < GeofenceRegionEvent

            def self.event_id
                Events::Constants::GEOFENCE_REGION_EXIT_EVENT_ID
            end

            Events::Pipeline.register("geofence-region", "exit", self, { targetable: true })

        end

    end
end
