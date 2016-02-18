require 'sneakers'
# # Rails.configure.rabbitmq is loaded from config/rabbbitmq.yml
opts = Rails.configuration.rabbitmq
if opts["ssl"] == true
    bunny = Bunny.new(opts["amqp"], { tls_ca_certificates: [opts["public_key"]], verify_peer: true })
else
    bunny = Bunny.new(opts["amqp"], vhost: "/")
end

num_workers = ENV['WEB_CONCURRENCY'].nil? ? 1 : ENV['WEB_CONCURRENCY'].to_i

Sneakers.configure(
    {
        connection: bunny,
        exchange_type: :direct,
        daemonize: false,
        log: $stdout,
        start_worker_delay: 0.2,
        workers: num_workers,
        pid_path: "pid/sneakers.pid",
        timeout_job_after: 1800,
        prefetch: 5,
        threads: 5,
        env: ENV['RACK_ENV'],
        durable: true,
        ack: true,
        heartbeat: 60,
        exchange: 'background_jobs',
        hooks: {
            before_fork: -> {
                Rails.logger.info('Worker: Disconnect from the database')
                ActiveRecord::Base.connection_pool.disconnect!
            },
            after_fork: -> {
                config = Rails.application.config.database_configuration[Rails.env]
                config['reaping_frequency'] = 10 # seconds
                ActiveRecord::Base.establish_connection(config)
                Rails.logger.info('Worker: Reconnect to the database')
            }
        }
    }
)

Sneakers.logger.level = Logger::INFO
