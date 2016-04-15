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

    def self.perform_async(message)
        # here we check what we need to queue

        current_time = Time.zone.now

        if message.scheduled_local_time == true
            # here we are finding the timezone offsets
            delay = (message.scheduled_at.utc - current_time).to_i
            # we need to enqueue from +12 to -12
            # +12 need to be scheduled 12 hours ahead of delay
            # and -12 needs to be scheduled 12 hours after delay
            #
            # These timezones are ahead so we need to schedule before
            for hour in -12..12
                local_delay = delay + (hour * 60 * 60)
                msg = {
                    message_id: message.id,
                    scheduled_token: message.scheduled_token,
                    time_zone_offset: hour
                }
                enqueue_message(msg, {to_queue: 'scheduled_message_jobs', headers: {'x-delay' => local_delay}})
            end

        else
            # we want to send at that specific time so we don't need the 24 delayed jobs
            delay = (message.scheduled_at.utc - current_time).to_i
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

    def merge_query(query1, query2)
        return query1.deep_merge(query2) {|k, a, b| a.is_a?(Array) && b.is_a?(Array) ? a + b : b}
    end


end
