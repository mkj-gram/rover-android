module RabbitMQPublisher
    class ConnectionPool

        def initialize(opts = {})
            @mutex = Mutex.new
            @opts = Sneakers::CONFIG.merge(opts)
        end

        def publish(msg, options = {})
            @mutex.synchronize do
                ensure_connection! unless connected?
            end
            to_queue = options.delete(:to_queue)
            options[:routing_key] ||= to_queue
            Sneakers.logger.info {"publishing <#{msg}> to [#{options[:routing_key]}]"}
            @exchange.publish(msg, options)
        end

        private

        def ensure_connection!
            # If we've already got a bunny object, use it.  This allows people to
            # specify all kinds of options we don't need to know about (e.g. for ssl).
            @bunny = @opts[:connection]
            @bunny ||= create_bunny_connection
            @bunny.start
            # initialize the channel to use a pool of workers to send
            @channel = @bunny.create_channel(nil, @opts[:pool])
            @exchange = @channel.exchange(@opts[:exchange], @opts[:exchange_options])
        end

        def connected?
            @bunny && @bunny.connected?
        end

        def create_bunny_connection
            p "creating channel"
            p @opts
            Bunny.new(@opts[:amqp], :vhost => @opts[:vhost], :heartbeat => @opts[:heartbeat], :logger => Sneakers::logger, tls_ca_certificates: [Rails.root.join('config','certs', 'rabbit_mq_public_key.pem').to_s])
        end
    end
end
