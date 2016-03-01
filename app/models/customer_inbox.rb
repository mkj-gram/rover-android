class CustomerInbox
    include Mongoid::Document

    # Use the existing customer_id
    field :_id, as: :customer_id, type: BSON::ObjectId
    field :messages_updated_at, type: DateTime, default: -> { DateTime.now }

    validates :_id, presence: true
    embeds_many :messages, class_name: "InboxMessage"

    def self.inbox_limit
        300
    end

    def message_rate_index
        current_time = Time.now
        one_year_limit = current_time - 1.year
        one_month_limit = current_time - 1.month
        one_week_limit = current_time - 1.week
        one_day_limit = current_time - 1.day
        @message_rate_index ||= messages.inject({}) do |hash, message|
            key = message.message_id || message.id
            if !hash.has_key?(key)
                hash[key] = {
                    messages_per_day: 0,
                    messages_per_week: 0,
                    messages_per_month: 0,
                    messages_per_year: 0
                }
            end
            saved_at = message.id.generation_time
            if saved_at > one_year_limit
                hash[key][:messages_per_year] += 1
            end
            if saved_at > one_month_limit
                hash[key][:messages_per_month] += 1
            end
            if saved_at > one_week_limit
                hash[key][:messages_per_week] += 1
            end
            if saved_at > one_day_limit
                hash[key][:messages_per_day] += 1
            end
            hash
        end
    end

    def read_message(inbox_message_id)
        message = messages.where("_id" => inbox_message_id).first
        if message && message.read == false
            message.read = true
            message.save
        end
    end

    def add_messages(inbox_messages)
        # we need to check limits
        # select all messages which pass the limit test
        message_rate = message_rate_index
        messages_to_add = inbox_messages.select do |inbox_message|
            # grab the schedule message or proximity message
            message = inbox_message.message
            if message.has_message_limits
                message.within_message_limits(message_rate)
            else
                true
            end
        end
        # bug
        # self.messages += messages_to_add
        # auto updates the document for some reason
        if messages_to_add.any?
            CustomerInbox.add_messages(self.id, messages_to_add)
            return messages_to_add
        else
            []
        end
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
