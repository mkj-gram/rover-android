class InboxMessage
    include Mongoid::Document

    # the id of the message which constructed this
    field :title, type: String, default: ""
    field :message_id, type: Integer
    field :notification_text, type: String
    field :read, type: Boolean, default: false
    field :saved_to_inbox, type: Boolean, default: true
    field :timestamp, type: Time

    embedded_in :customer_inbox

    def message
        @message ||= Message.find_by_id(message_id)
    end

    def message=(val)
        @message = val
    end

end
