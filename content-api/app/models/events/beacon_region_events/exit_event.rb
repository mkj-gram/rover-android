module Events
    module BeaconRegionEvents

        class ExitEvent < BeaconRegionEvent

            def self.event_id
                Events::Constants::BEACON_REGION_EXIT_EVENT_ID
            end

            Events::Pipeline.register("beacon-region", "exit", self, { targetable: true })

        end

    end
end
