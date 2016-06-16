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

    # args => { message_template_id: 1} optional time_zone_offset
    def perform(args)
        message_template = MessageTemplate.find(args["message_template_id"])
        if args.include?("time_zone_offset")
            if message_template.customer_segment
                base_query = message_template.customer_segment.to_elasticsearch_query
            else
                base_query = {}
            end

            time_zones = TimeZoneOffset.get_time_zones_for_offset(args["time_zone_offset"])

            time_zone_query = {
                filter: {
                    bool: {
                        must: [
                            {
                                nested: {
                                    path: "devices",
                                    filter: {
                                        terms: {
                                            "devices.time_zone" => time_zones
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }

            segment_query = merge_queries(base_query, time_zone_query)
        else
            if message_template.customer_segment
                segment_query = message_template.customer_segment.to_elasticsearch_query
            else
                segment_query = {}
            end
        end

        SendMessageWorker.perform_async(message_template.id, segment_query)
        ack!

    end

    private

    def merge_queries(queryOne, queryTwo)
        return queryOne.deep_merge(queryTwo) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
    end
end
