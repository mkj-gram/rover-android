module Events
    module GimbalPlaceEvents

        class ExitEvent < GimbalPlaceEvent

            def self.event_id
                Events::Constants::GIMBAL_PLACE_EXIT_EVENT_ID
            end

            Events::Pipeline.register("gimbal-place", "exit", self, { targetable: true })
        end

    end
end
