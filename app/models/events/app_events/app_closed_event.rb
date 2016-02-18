class AppClosedEvent < AppEvent

    def self.event_id
        Event::APP_CLOSED_EVENT_ID
    end
end
