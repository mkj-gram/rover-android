module V1::InboxMessageSerializer
    class << self
        def serialize(message)
            {
                type: "messages",
                id: message.id.to_s,
                attributes: {
                    title: message.title,
                    :"notification-text" => message.notification_text,
                    read: message.read,
                    # :"saved-to-inbox" => message.saved_to_inbox,
                    timestamp: message.timestamp.utc.iso8601
                }
            }
        end
    end
end
