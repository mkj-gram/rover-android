require 'colorize'
class ScheduledMessageJobWorker
    include BackgroundWorker::Worker

    from_queue 'scheduled_message_jobs_worker',
        :durable => true,
        :ack => true,
        :threads => 1,
        :prefetch => 1,
        :exchange => 'delayed_exchange',
        :exchange_type => 'x-delayed-message',
        :exchange_arguments => {'x-delayed-type' => 'direct'},
        :heartbeat => 5


    def self.perform_async(msg, delay)
        enqueue_message(msg, {to_queue: 'scheduled_message_jobs_worker', headers: {'x-delay' => delay}})
    end

    # args => { message_template_id: 1} optional time_zone_offset
    def perform(args)
        message_template = MessageTemplate.find(args["message_template_id"])

        time_zone_offset = nil

        if args.include?("time_zone_offset")
            time_zone_offset = args["time_zone_offset"].to_i
        end

        SendMessageWorker.perform_async(message_template.id, {}, [], time_zone_offset)
        ack!

    end

    private

    def merge_queries(queryOne, queryTwo)
        return queryOne.deep_merge(queryTwo) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
    end
end
