class AppEvent < Event

    def self.event_id
        Event::APP_EVENT_ID
    end

    def self.build_event(object, action, event_attributes)
        case action
        when "open"
            AppOpenEvent.new(event_attributes)
        when "closed"
            AppClosedEvent.new(event_attributes)
        else
            Event.new(event_attributes)
        end
    end


    private

    def messages
        @messages ||= ProximityMessage.where(account_id: account.id, trigger_event_id: self.class.event_id)
    end

end
