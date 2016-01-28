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
            def enqueue_message(message, options)
                if BackgroundWorker.run_inline?
                    get_base_instance.work(message)
                else
                    RabbitMQPublisher.publish(message, options)
                end
            end

            def get_base_instance
                @base_isntance ||= self.new
            end
        end

        def self.included(receiver)
            receiver.extend         ClassMethods
            receiver.send :include, Sneakers::Worker
        end
    end

end
