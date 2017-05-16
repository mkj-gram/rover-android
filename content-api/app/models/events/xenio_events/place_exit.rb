module Events
    module XenioEvents
        class PlaceExit < XenioEvent

            def self.event_id
                Events::Constants::XENIO_PLACE_EXIT_ID
            end

            Events::Pipeline.register("xenio-place", "exit", self, { targetable: true })
       
        end
    end
end