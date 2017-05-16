module Events
    module AppEvents

        class OpenEvent < AppEvent

            def self.event_id
                Events::Constants::APP_OPEN_EVENT_ID
            end

            Events::Pipeline.register("app", "open", self, { targetable: true })
        end

    end
end
