class CustomerInbox
    include Mongoid::Document

    # Use the existing customer_id
    field :_id, as: :customer_id, type: BSON::ObjectId
    field :messages_updated_at, type: DateTime, default: -> { DateTime.now }
    validates :_id, presence: true
    embeds_many :messages, class_name: "InboxMessage"

    def self.inbox_limit
        100
    end

    def read_message(inbox_message_id)

    end

    def self.add_messages(customer_id, inbox_messages)
        client = CustomerInbox.mongo_client
        client[CustomerInbox.collection_name].update_one(
            {
                "_id" => customer_id
            },
            {
                "$push" => {
                    "messages" => {
                        "$each" => inbox_messages.map{|inbox_message| inbox_message.attributes},
                        "$sort" => {"_id" => 1},
                        "$slice" => -CustomerInbox.inbox_limit
                    }
                    # sort by the embeded objectid
                },
                "$set" => {
                    "messages_updated_at" => DateTime.now
                }
            }
        )
    end
end
