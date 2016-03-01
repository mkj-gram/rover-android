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
        @message_rate_index ||= messages.inject({global_messages_per_year: 0, global_messages_per_month: 0, global_messages_per_week: 0, global_messages_per_day: 0}) do |hash, message|
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
                hash[:global_messages_per_year] += 1
            end
            if saved_at > one_month_limit
                hash[key][:messages_per_month] += 1
                hash[:global_messages_per_month] += 1
            end
            if saved_at > one_week_limit
                hash[key][:messages_per_week] += 1
                hash[:global_messages_per_week] += 1
            end
            if saved_at > one_day_limit
                hash[key][:messages_per_day] += 1
                hash[:global_messages_per_day] += 1
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

        message_rate = message_rate_index

        # loop through pre-adding to the message_rate and then see if we are still within the limit
        messages_to_add = inbox_messages.select do |inbox_message|
            # now filter
            # TODO kinda ugly
            within_limit = (
                (account.global_message_limit_per_day.nil?      || message_rate[:global_messages_per_day]    < account.global_message_limit_per_day)     &&
                (account.global_message_limit_per_week.nil?     || message_rate[:global_messages_per_week]   < account.global_message_limit_per_week)   &&
                (account.global_message_limit_per_month.nil?    || message_rate[:global_messages_per_month]  < account.global_message_limit_per_month) &&
                (account.global_message_limit_per_year.nil?     || message_rate[:global_messages_per_year]   < account.global_message_limit_per_year)
            )

            if within_limit
                # we increase the global limit counters after selecting a message which passes
                [:global_messages_per_day, :global_messages_per_week, :global_messages_per_month, :global_messages_per_year].each do |key|
                    message_rate[key] += 1
                end
            else
                Rails.logger.warn("Message with message_id #{inbox_message.message_id} not within global_limit")
            end
            within_limit
        end


        messages_to_add = messages_to_add.select do |inbox_message|
            # grab the schedule message or proximity message
            message = inbox_message.message
            within_limit = true
            if message.has_message_limits
                within_limit = message.within_message_limits(message_rate)
            end

            if within_limit
                if !message_rate.has_key?(inbox_message.message_id)
                    # if this message doesn't exist in the inbox
                    message_rate[inbox_message.message_id] = {
                        messages_per_day: 0,
                        messages_per_week: 0,
                        messages_per_month: 0,
                        messages_per_year: 0
                    }

                end
                [:messages_per_day, :messages_per_week, :messages_per_month, :messages_per_year].each do |key|
                    message_rate[inbox_message.message_id][key] += 1
                end
            else
                Rails.logger.warn("Message with message_id #{inbox_message.message_id} not within local_limit")
            end
            within_limit
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
end
