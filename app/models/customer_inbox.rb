class CustomerInbox

    KEY_PREFIX = "inbox_".freeze
    INBOX_LIMIT = 150

    def self.redis_client
        return $redis
    end

    # inserts = [inbox => message]
    def self.bulk_insert(inserts)

        redis_client = CustomerInbox.redis_client

        expired_message_futures = []

        redis_client.pipelined do
            inserts.each do |inbox, message|
                expired_message_futures.push(redis_client.lrange(inbox.inbox_key, INBOX_LIMIT, -1))
                redis_client.ltrim(inbox.inbox_key, 0, INBOX_LIMIT - 1)
                redis_client.lpush(inbox.inbox_key, message.id)
            end
        end
        expired_message_ids = expired_message_futures.map(&:value).flatten.uniq

        if expired_message_ids.any?
            Message.delete_all(id: {"$in" => expired_message_ids})
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

    def add_message(message)
        CustomerInbox.bulk_insert({self => message})
    end

    def remove_message(message_id, opts = {})
        redis_client = CustomerInbox.redis_client

        redis_client.lrem(inbox_key, 0, message_id)
    end

    def inbox_key
        KEY_PREFIX + @customer.id.to_s
    end

end
