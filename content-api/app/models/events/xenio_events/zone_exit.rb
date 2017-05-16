module Events
    module XenioEvents
        class ZoneExit < XenioEvent

            def self.event_id
                Events::Constants::XENIO_ZONE_EXIT_ID
            end

            Events::Pipeline.register("xenio-zone", "exit", self, { targetable: true })
       
        end
    end
end