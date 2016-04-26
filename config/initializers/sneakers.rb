require 'sneakers'
# # Rails.configure.rabbitmq is loaded from config/rabbbitmq.yml
opts = Rails.configuration.rabbitmq
if opts["ssl"] == true
    bunny = Bunny.new(opts["amqp"], { tls_ca_certificates: [opts["public_key"]], verify_peer: true })
else
    bunny = Bunny.new(opts["amqp"], vhost: "/")
end

num_workers = ENV['WEB_CONCURRENCY'].nil? ? 2 : ENV['WEB_CONCURRENCY'].to_i

Sneakers.configure(
    {
        connection: bunny,
        exchange_type: :direct,
        daemonize: false,
        log: STDOUT,
        start_worker_delay: 1,
        workers: num_workers,
        pid_path: "pid/sneakers.pid",
        timeout_job_after: 1800,
        prefetch: 5,
        threads: 5,
        share_threads: true,
        env: ENV['RACK_ENV'],
        durable: true,
        ack: true,
        heartbeat: 60,
        exchange: 'background_jobs',
        hooks: {
        }
    }
)
Sneakers.logger.level = Logger::INFO
