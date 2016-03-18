require 'fluent-logger'

module EventsLogger

    class << self
        def log(account_id, timestamp, event)
            client.post_with_time("account_#{account_id}.event", event, timestamp)
        end

        def client
            @client ||= Fluent::Logger::FluentLogger.new(nil, host: Rails.configuration.event_logger["host"], port: Rails.configuration.event_logger["port"])
        end
    end
end
