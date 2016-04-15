class InboxMessage
    include Mongoid::Document

    # the id of the message which constructed this
    field :title, type: String, default: ""
    field :message_id, type: Integer
    field :notification_text, type: String
    field :tags, type: Array, default: []
    field :read, type: Boolean, default: false
    field :saved_to_inbox, type: Boolean, default: true
    field :action, type: String
    field :action_url, type: String
    # field :landing_page, type: LandingPage
    # field :experience, type: Experience
    field :timestamp, type: Time

    embedded_in :customer_inbox

    def scheduled_at
        message.scheduled_at
    end

    def message
        @message ||= Message.find_by_id(message_id)
    end

    def message=(val)
        @message = val
    end

end
