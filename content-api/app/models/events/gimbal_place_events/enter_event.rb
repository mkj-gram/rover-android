module Events
    module GimbalPlaceEvents

        class EnterEvent < GimbalPlaceEvent

            def self.event_id
                Events::Constants::GIMBAL_PLACE_ENTER_EVENT_ID
            end

            Events::Pipeline.register("gimbal-place", "enter", self, { targetable: true })
        end

    end
end
