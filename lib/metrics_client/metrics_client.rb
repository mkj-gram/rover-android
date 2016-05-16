# To be used by the backend workers since they don't have access to librato-rails
require 'colorize'
require 'concurrent'
module MetricsClient

    class << self

        @@mutex = Mutex.new
        @@submitter_lock = Mutex.new

        def aggregator
            return @aggregator if @aggregator
            authenticate!
            return @aggregator
        end

        def aggregate(opts)
            @@submitter_lock.synchronize do
                aggregator.add(opts)
            end
        end

        def time(name, options = {})
            start = Time.now
            yield.tap do
                duration = (Time.now - start) * 1000.0 # milliseconds
                metric = {name => options.merge({:value => duration})}
                aggregate(metric)
            end
        end

        def flush!
            return if aggregator.empty?
            submitter_queue = ::Librato::Metrics::Queue.new(prefix: config.prefix, source: config.source)
            @@submitter_lock.synchronize do
                submitter_queue.merge!(aggregator)
                aggregator.clear
            end
            Rails.logger.debug(submitter_queue.queued)
            submitter_queue.submit if !submitter_queue.empty?
        end

        def submitter
            @@submitter
        end

        private

        def config
            @@config ||= ::Librato::Rails::Configuration.new
        end

        def authenticate!
            return if @authenticated
            @@mutex.synchronize {
                Librato::Metrics.authenticate(config.user, config.token)
                flush_interval = config.flush_interval || 60
                @@submitter = Concurrent::TimerTask.new(execution_interval: flush_interval, timeout_interval: 30) do
                    Rails.logger.info("[ MetricsClient ] Submitting Metrics!".blue.bold)
                    begin
                        MetricsClient.flush!
                    rescue => e
                        Rails.logger.info("[ MetricsClient ] Error submitting metrics #{e.message}".blue.bold)
                    end
                    Rails.logger.info("[ MetricsClient ] Done!".blue.bold)
                end

                @aggregator = ::Librato::Metrics::Aggregator.new(prefix: config.prefix, source: config.source)
            }
            @@submitter.execute
        end

    end

end
