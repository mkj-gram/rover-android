module Events
    module AppEvents

        class ClosedEvent < AppEvent

            def self.event_id
                Events::Constants::APP_CLOSED_EVENT_ID
            end

            Events::Pipeline.register("app", "closed", self, { targetable: true })
        end

    end
end
