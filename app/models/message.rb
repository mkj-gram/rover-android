# Messages are derived from message templates
class Message
    include Mongoid::Document

    field :message_template_id, type: Integer
    field :customer_id, type: BSON::ObjectId
    field :notification_text, type: String
    field :ios_title, type: String, default: ""
    field :android_title, type: String, default: ""
    field :tags, type: Array, default: []
    field :read, type: Boolean, default: false
    field :viewed, type: Boolean, default: false
    field :saved_to_inbox, type: Boolean, default: true
    field :action, type: String
    field :action_url, type: String
    field :timestamp, type: Time , default: -> { Time.zone.now }
    field :expire_at, type: Time

    index({ expire_at: 1 }, { sparse: true,  expire_after_seconds: 0 })

    belongs_to :customer
    # belongs_to: message nope

    # validates :message_id, presence: true
    # validates :customer_id, presence: true
    # validates :timestamp, presence: true

    before_create :set_expire
    after_create :add_to_inbox


    def self.temporary_message_expire_time
        1.month
    end

    def message_template=(template)
        @message_template = template
        self["message_template_id"] = template.id
    end

    def message_template
        @message_template ||= MessageTemplate.find_by_id(message_template_id)
    end

    private

    # We expire messages which aren't saved to the inbox
    def set_expire
        if saved_to_inbox == false
            self.expire_message_at = Time.zone.now + MessageInstance.temporary_message_expire_time
        end
    end

    def add_to_inbox
        if saved_to_inbox == true
            customer.inbox.add_message(self)
        end
    end

end
