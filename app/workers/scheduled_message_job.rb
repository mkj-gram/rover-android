require 'colorize'
class ScheduledMessageJob
    include BackgroundWorker::Worker

    from_queue 'scheduled_message_jobs',
        :durable => true,
        :ack => true,
        :threads => 1,
        :prefetch => 1,
        :exchange => 'delayed_exchange',
        :exchange_type => 'x-delayed-message',
        :exchange_arguments => {'x-delayed-type' => 'direct'},
        :heartbeat => 5

    TIME_ZONE_OFFSETS = [-12.0, -11.0, -10.0, -9.5, -9.0, -8.0, -7.0, -6.0, -5.0, -4.5, -4.0, -3.0, -2.5, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0, 4.5, 5.0, 5.5, 5.75, 6.0, 6.5, 7.0, 8.0, 8.5, 8.75, 9.0, 9.5, 10.0, 10.5, 11.0, 12.0, 13, 14].freeze

    def self.perform_async(message)
        # here we check what we need to queue

        current_time = Time.zone.now

        if message.scheduled_local_time == true
            # here we are finding the timezone offsets
            delay = (message.scheduled_at.utc - current_time).to_i * 1000

            for hour in TIME_ZONE_OFFSETS
                local_delay = delay + (hour * 60 * 60 * 1000)
                msg = {
                    message_id: message.id,
                    scheduled_token: message.scheduled_token,
                    time_zone_offset: hour
                }
                enqueue_message(msg, {to_queue: 'scheduled_message_jobs', headers: {'x-delay' => local_delay}})
            end

        else
            # we want to send at that specific time so we don't need the 24 delayed jobs
            # delay is measured in milliseconds
            delay = (message.scheduled_at.utc - current_time).to_i * 1000
            msg = {
                message_id: message.id,
                scheduled_token: message.scheduled_token
            }
            enqueue_message(msg, {:to_queue => 'scheduled_message_jobs', headers: {'x-delay' => delay}})
        end
    end


    def perform(args)
        message = Message.find(args["message_id"])
        if message.scheduled_token != args["scheduled_token"]
            Sneakers.logger.info("PUBLISH TOKEN missmatch message: #{message.scheduled_token} job: #{args['scheduled_token']}".red.bold)
            ack!
        else
            if args.include?("time_zone_offset")
                if message.customer_segment
                    base_query = message.customer_segment.to_elasticsearch_query
                else
                    base_query = {}
                end

                time_zones = TimeZoneOffset.get_time_zones_for_offset(args["time_zone_offset"])
                if time_zones.empty?
                    puts "EMPTY? #{args['time_zone_offset']}"
                    return ack!
                end
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
                if message.customer_segment
                    segment_query = message.customer_segment.to_elasticsearch_query
                else
                    segment_query = {}
                end
            end

            SendMessageWorker.perform_async(message.id, segment_query)
            ack!

        end
    end

    private

    def merge_queries(queryOne, queryTwo)
        return queryOne.deep_merge(queryTwo) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
    end
end
