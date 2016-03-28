class CustomerInbox
    include Mongoid::Document

    # Use the existing customer_id
    field :_id, as: :customer_id, type: BSON::ObjectId
    field :messages_updated_at, type: DateTime, default: -> { DateTime.now }

    validates :_id, presence: true
    embeds_many :messages, class_name: "InboxMessage"

    belongs_to :customer

    def self.inbox_limit
        300
    end

    def message_rate_index(global_limits, message_limits)
        current_time = Time.now
        tmp_messages.inject({global_count: Hash.new(0), messages: {}}) do |hash, message|
            key = message.message_id
            next if key.nil?

            if !hash[:messages].has_key?(key)
                hash[:messages][key] = Hash.new(0)
            end

            saved_at = message.id.generation_time
            number_of_minutes = ((current_time - saved_at).to_i / 60) + 1
            # we are going to loop through the global limits and update the index
            # based on what they are interested in

            global_limits.each do |limiter|
                if number_of_minutes <= limiter.number_of_minutes
                    hash[:global_count][limiter.number_of_minutes] += 1
                end
            end

            message_limits.each do |limiter|
                if number_of_minutes <= limiter.number_of_minutes
                    hash[:messages][key][limiter.number_of_minutes] += 1
                end
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

    def add_messages(inbox_messages, account)

        # use the new redis client
        messages_to_add = inbox_messages.select do |message|
            limits = message.limits + account.message_limits
            MessageRateLimit.add_message(message, customer, message.limits, account.message_limits)
        end
        # not a bug but build into mongoid and you can't turn it off
        # self.messages += messages_to_add
        # auto updates the document for some reason
        if messages_to_add.any?
            Rails.logger.info("Adding #{messages_to_add.size} message(s) to customer inbox")
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

    private

    def tmp_messages
        @tmp_messages ||= messages.dup
    end

end
