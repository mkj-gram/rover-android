module Events
    module BeaconRegionEvents

        class EnterEvent < BeaconRegionEvent

            def self.event_id
                Events::Constants::BEACON_REGION_ENTER_EVENT_ID
            end

            Events::Pipeline.register("beacon-region", "enter", self, { targetable: true })
        end

    end
end
