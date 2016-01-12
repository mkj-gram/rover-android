require 'sneakers'
# Rails.configure.rabbitmq is loaded from config/rabbbitmq.yml
opts = Rails.configuration.rabbitmq
if opts["ssl"] == true
    bunny = Bunny.new(opts["amqp"], { tls_ca_certificates: [opts["public_key"]], verify_peer: true })
else
    bunny = Bunny.new(opts["amqp"])
end

Sneakers.configure (
    {
        connection: bunny,
        :exchange_type => :direct,
        :runner_config_file => nil,
        :metrics => nil,             # A metrics provider implementation
        :daemonize => false,          # Send to background
        :start_worker_delay => 0.2,  # When workers do frenzy-die, randomize to avoid resource starvation
        :workers => ENV['WEB_CONCURRENCY'] || 4,               # Number of per-cpu processes to run
        # :log  => 'log/sneakers.log',     # Log file
        :pid_path => 'pid/sneakers.pid', # Pid file

        :timeout_job_after => 5,      # Maximal seconds to wait for job
        :prefetch => 10,              # Grab 10 jobs together. Better speed.
        :threads => 10,               # Threadpool size (good to match prefetch)
        :env => ENV['RACK_ENV'],      # Environment
        :durable => true,             # Is queue durable?
        :ack => true,                 # Must we acknowledge?
        :heartbeat => 60,              # Keep a good connection with broker
        :exchange => 'background_jobs',      # AMQP exchange
        :hooks => {}                  # prefork/postfork hooks
    }
)

Sneakers.logger.level = Logger::INFO
