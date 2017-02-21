module Events
    module XenioEvents
        class PlaceEnter < XenioEvent

            def self.event_id
                Events::Constants::XENIO_PLACE_ENTER_ID
            end

            Events::Pipeline.register("xenio-place", "enter", self, { targetable: true })
       
        end
    end
end