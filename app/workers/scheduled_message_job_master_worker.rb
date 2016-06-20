require 'colorize'
class ScheduledMessageJobMasterWorker
    include BackgroundWorker::Worker

    from_queue 'scheduled_message_jobs_master_worker',
        :durable => true,
        :ack => true,
        :threads => 1,
        :prefetch => 1,
        :exchange => 'delayed_exchange',
        :exchange_type => 'x-delayed-message',
        :exchange_arguments => {'x-delayed-type' => 'direct'},
        :heartbeat => 5

    TIME_ZONE_OFFSETS = [-12.0, -11.0, -10.0, -9.5, -9.0, -8.0, -7.0, -6.0, -5.0, -4.5, -4.0, -3.0, -2.5, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0, 4.5, 5.0, 5.5, 5.75, 6.0, 6.5, 7.0, 8.0, 8.5, 8.75, 9.0, 9.5, 10.0, 10.5, 11.0, 12.0, 13, 14].freeze

    def self.perform_async(message_template)
        # here we check what we need to queue

        if message_template.scheduled_local_time
            # if we are using local time make sure to start the job at the furthest timezone + 14
            delay = [((message_template.utc - 14.hours) - Time.zone.now).to_i * 1000, 0].max
        else
            delay = [(message_template.scheduled_at.utc - Time.zone.now).to_i * 1000, 0].max
        end

        msg = {
            message_template_id: message_template.id,
            scheduled_token: message_template.scheduled_token
        }

        enqueue_message(msg, { to_queue: 'scheduled_message_jobs_master_worker', headers: { 'x-delay' => delay }})
    end

    def perform(args)
        message_template = MessageTemplate.find(args["message_template_id"])
        if message_template.scheduled_token != args["scheduled_token"]
            Sneakers.logger.info("PUBLISH TOKEN missmatch message_template: #{message_template.scheduled_token} job: #{args['scheduled_token']}".red.bold)
            ack!
        else
            message_template.update_attributes(sent: true)

            current_time = Time.zone.now

            if message_template.scheduled_local_time == true && !message_template.scheduled_at.nil?
                # here we are finding the timezone offsets
                for hour in TIME_ZONE_OFFSETS
                    # if we are 4 hours behind utc then we are delayed + 4 hours
                    
                    local_delay = [(((message_template.scheduled_at.utc - hour.hours)) - current_time).to_i * 1000, 0].max

                    local_delay = delay + (hour * 60 * 60 * 1000)
                    msg = {
                        message_template_id: message_template.id,
                        time_zone_offset: hour
                    }
                    ScheduledMessageJobWorker.perform_async(msg, local_delay)
                end

            elsif !message_template.scheduled_at.nil?

                # we want to send at that specific time so we don't need the 24 delayed jobs
                # delay is measured in milliseconds
                delay = (message_template.scheduled_at.utc - current_time).to_i * 1000
                msg = {
                    message_template_id: message_template.id,
                }
                ScheduledMessageJobWorker.perform_async(msg, delay)
            else
                msg = {
                    message_template_id: message_template.id,
                }
                ScheduledMessageJobWorker.perform_async(msg, 0)
            end
        end
    end
end
