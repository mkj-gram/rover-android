module Events
    module AppEvents

        class AppEvent < Event

            def self.event_id
                Events::Constants::APP_EVENT_ID
            end

            private

            def messages
                @messages ||= ProximityMessage.where(account_id: account.id, trigger_event_id: self.class.event_id)
            end
        end

    end
end
