# To be used by the backend workers since they don't have access to librato-rails
require 'colorize'
require 'concurrent'
module MetricsClient

    class << self

        @@mutex = Mutex.new
        @@submitter_lock = Mutex.new

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

        def aggregate(opts)
            @@submitter_lock.synchronize do
                aggregator.add(opts)
            end
        end

        def flush!
            @@submitter_lock.synchronize do
                queue.submit if !queue.empty?
                Rails.logger.debug(aggregator.queued)
                aggregator.submit if !aggregator.empty?
            end
        end

        def submitter
            @@submitter
        end

        private

        def authenticate!
            return if @authenticated
            @@mutex.synchronize {
                config = ::Librato::Rails::Configuration.new
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

                @queue = ::Librato::Metrics::Queue.new(prefix: config.prefix, source: config.source)
                @aggregator = ::Librato::Metrics::Aggregator.new(prefix: config.prefix, source: config.source)
            }
            @@submitter.execute
        end

    end

end
