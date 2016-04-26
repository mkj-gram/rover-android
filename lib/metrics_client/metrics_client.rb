# To be used by the backend workers since they don't have access to librato-rails
module MetricsClient

    class << self

        @@mutex = Mutex.new

        def queue
            return @queue if @queue
            authenticate!
            return @queue
        end

        def aggregator
            return @aggregator if @aggregator
            authenticate!
            return @aggregator
        end

        def flush!
            queue.submit
            aggregator.submit
        end

        private

        def authenticate!
            return if @authenticated
            @@mutex.synchronize {
                config = ::Librato::Rails::Configuration.new
                Librato::Metrics.authenticate(config.user, config.token)
                flush_interval = config.flush_interval || 60
                @queue = ::Librato::Metrics::Queue.new(autosubmit_interval: flush_interval, prefix: config.prefix, source: config.source)
                @aggregator = ::Librato::Metrics::Aggregator.new(autosubmit_interval: flush_interval, prefix: config.prefix, source: config.source)
            }
        end

    end

end
