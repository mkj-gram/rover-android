module Events
    module XenioEvents
        class ZoneEnter < XenioEvent

            def self.event_id
                Events::Constants::XENIO_ZONE_ENTER_ID
            end

            Events::Pipeline.register("xenio-zone", "enter", self, { targetable: true })
       
        end
    end
end