class CustomerInbox

    KEY_PREFIX = "inbox_".freeze
    INBOX_LIMIT = 150

    def self.redis_client
        return $redis
    end

    def self.bulk_insert(inserts)
        # customers = [inbox=> message]
        redis_client = CustomerInbox.redis_client

        expired_message_futures = []

        redis_client.pipelined do
            inserts.each do |inbox, message|
                expired_message_futures.push(redis_client.lrange(inbox.inbox_key, INBOX_LIMIT, -1))
                redis_client.ltrim(inbox.inbox_key, 0, INBOX_LIMIT - 1)
                redis_client.lpush(inbox.inbox_key, message.id)
            end
        end
        expired_message_instance_ids = expired_message_futures.map(&:value).flatten.uniq

        if expired_message_instance_ids.any?
            MessageInstance.delete_all(id: {"$in" => expired_message_instance_ids})
        end

        return inserts.keys.size
    end

    attr_reader :customer

    def initialize(customer)
        @customer = customer
    end

    def messages
        @messages ||= -> {
            message_ids = CustomerInbox.redis_client.lrange(inbox_key, 0, -1)
            if message_ids.empty?
                []
            else
                Message.find(message_ids)
            end
        }.call
    end

    def add_message(message_instance)

        CustomerInbox.bulk_insert({self => message_instance})

        # redis_client = CustomerInbox.redis_client

        # message_instance_id = message_instance.is_a?(MessageInstance) ? message_instance.id : message_instance
        # expired_message_instance_ids = redis_client.lrange(inbox_key, INBOX_LIMIT, -1)
        # expired_messages = MessageInstance.delete_all(id: {"$in" => expired_message_instance_ids}) if expired_message_instance_ids
        # redis_client.pipelined do
        #     redis_client.ltrim(inbox_key, 0, INBOX_LIMIT - 1)
        #     redis_client.lpush(inbox_key, message_instance_id)
        # end

    end

    def remove_message(message_instance_id, opts = {})
        redis_client = CustomerInbox.redis_client

        redis_client.lrem(inbox_key, 0, message_instance_id)
    end

    def inbox_key
        KEY_PREFIX + @customer.id.to_s
    end

end

#     # Use the existing customer_id
#     field :_id, as: :customer_id, type: BSON::ObjectId
#     field :messages_, type: DateTime, default: -> { DateTime.now }

#     validates :_id, presence: true
#     embeds_many :notifications, class_name: "Notification"

#     belongs_to :customer, foreign_key: "_id"

#     def self.inbox_limit
#         150
#     end

#     def read_notification(notification_id)
#     end
#     # each notification is its own document
#     # Customer Inbox is a wrapper around redis client to add and fetch notifications
#     #
#     def read_message(inbox_message_id)
#         message = messages.where("_id" => inbox_message_id).first
#         if message && message.read == false
#             message.read = true
#             message.save
#         end
#     end

#     def add_messages(inbox_messages, account)

#         # use the new redis client
#         # messages_to_add = inbox_messages.select do |inbox_message|
#         #     message = inbox_message.message
#         #     MessageRateLimit.add_message(message, customer, message.limits, account.message_limits)
#         # end
#         # not a bug but build into mongoid and you can't turn it off
#         # self.messages += messages_to_add
#         # auto updates the document for some reason
#         if inbox_messages.any?
#             Rails.logger.info("Adding #{inbox_messages.size} message(s) to customer inbox")
#             CustomerInbox.add_messages(self.id, inbox_messages)
#             return inbox_messages
#         else
#             []
#         end
#     end


#     def self.add_messages(customer_id, inbox_messages)

#         client = CustomerInbox.mongo_client
#         client[CustomerInbox.collection_name].update_one(
#             {
#                 "_id" => customer_id
#             },
#             {
#                 "$push" => {
#                     "messages" => {
#                         "$each" => inbox_messages.map{|inbox_message| inbox_message.attributes},
#                         "$sort" => {"_id" => 1},
#                         "$slice" => -CustomerInbox.inbox_limit
#                     }
#                     # sort by the embeded objectid
#                 },
#                 "$set" => {
#                     "messages_updated_at" => DateTime.now
#                 }
#             }
#         )
#     end

#     private

#     def tmp_messages
#         @tmp_messages ||= messages.dup
#     end

# end
