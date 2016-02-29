class InboxMessage
    include Mongoid::Document

    field :notification_text, type: String
    field :read, type: Boolean, default: false

    embedded_in :customer_inbox
end
