module BackgroundWorker
    class << self
        @run_inline = false

        def configure(opts = {})
            @run_inline = opts.fetch(:run_inline, false)
        end

        def run_inline!
            @run_inline = true
        end

        def run_inline?
            return @run_inline
        end

    end

    module Worker
        module ClassMethods

            private

            def worker_publisher
                @worker_publisher ||= RabbitMQPublisher.new(queue_opts)
            end

            def enqueue_message(message, options)
                options.merge!(:content_type => 'application/json')
                message = message.to_json
                if BackgroundWorker.run_inline?
                    get_base_instance.work(message)
                else
                    worker_publisher.publish(message, options)
                end
            end

            def get_base_instance
                @base_isntance ||= self.new
            end
        end

        module InstanceMethods

            def work(msg)
                decoded_message = JSON.parse(msg).with_indifferent_access
                begin
                    perform(decoded_message)
                    return :ack
                rescue Exception => e
                    Rails.logger.info("FAILED: #{self.class.name} failed to perform #{msg}")
                    raise e
                end
            end
        end

        def self.included(receiver)
            receiver.send :include, InstanceMethods
            receiver.extend         ClassMethods
            receiver.send :include, Sneakers::Worker


        end
    end

end
