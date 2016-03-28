class MessageRateLimit


    # takes a message
    # each message has a rolling window
    # there is an aggregate for global limits per user as well
    # they work the same way but the key is "gloabl"
    def self.add_message(message, customer, message_limits = [], global_limits = [])
        return (
            add_to_limit(get_global_rate_limit_key(customer), global_limits) &&
            add_to_limit(get_message_rate_limit_key(customer, message), message_limits + global_limits)
        )
    end

    private

    def self.get_global_rate_limit_key(customer)
        "#{customer.id.to_s}"
    end

    def self.get_message_rate_limit_key(customer, message)
        "#{customer.id.to_s}:#{message.id.to_s}"
    end

    def self.add_to_limit(key, limits = [])
        time = Time.now.to_i
        # drop all keys from the largets limit
        if limits.any?
            largest_limit = limits.sort_by(&:number_of_seconds).last
            drop_interval = time - largest_limit.number_of_minutes
            client.zremrangebyscore(key, "#{drop_interval}", "+inf")
            # drop all events which are older than our time interval
            # each limit count how events exist
            count_intervals = {}
            client.pipelined do
                limits.each do |limit|
                    drop_interval = time - limit.number_of_seconds
                    count = client.zcount(key, "#{drop_interval}", "+inf")
                    count_intervals[limit] = count
                end
            end

            allowed = limits.all?{|limit| count_intervals[limit].value < limit.message_limit}

            if allowed
                client.zadd(key, time, time)
                expire_in = largest_limit.number_of_seconds
                client.expire(key, expire_in)
                return true
            else
                return false
            end
        else
            return true
            # just add and return
            # expire should be our highest 90 days
        end
    end

    def self.client
        return $redis
    end
end
