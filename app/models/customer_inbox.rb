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

    def message_rate_index(global_limits, message_limits)
        current_time = Time.now
        tmp_messages.inject({global_count: Hash.new(0), messages: {}}) do |hash, message|
            key = message.message_id
            next if key.nil?

            if !hash[:messages].has_key?(key)
                hash[:messages][key] = Hash.new(0)
            end

            saved_at = message.id.generation_time
            number_of_days = ((current_time - saved_at).to_i / (24 * 60 * 60) + 1)
            # we are going to loop through the global limits and update the index
            # based on what they are interested in

            global_limits.each do |limiter|
                if number_of_days <= limiter.number_of_days
                    hash[:global_count][limiter.number_of_days] += 1
                end
            end

            message_limits.each do |limiter|
                if number_of_days <= limiter.number_of_days
                    hash[:messages][key][limiter.number_of_days] += 1
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

    # TODO
    # clean this up a lot maybe put everyting into a helper class
    def add_messages(inbox_messages, account)
        message_limits = inbox_messages.map{|inbox_message| inbox_message.message.limits }.flatten
        message_rate = message_rate_index(account.message_limits, message_limits)

        messages_to_add = inbox_messages.select do |inbox_message|
            if account.within_message_limits(message_rate[:global_count])
                message_rate[:global_count][1] += 1
                true
            else
                false
            end
        end

        messages_to_add = messages_to_add.select do |inbox_message|
            message = inbox_message.message
            key = message.id
            within_limit = true
            if message.has_message_limits
                within_limit = message.within_message_limits(message_rate[:messages][key])
            end

            if within_limit
                tmp_messages << inbox_message
                message_rate = message_rate_index(account.message_limits, message_limits)
            end
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
