module RoverApnsHelper

    class << self

        def production_connection
            @production_connection ||= ApnsKit::Client.production(get_certificate, pool_size: 1, heartbeat_interval: 60)
        end

        def development_connection
            @development_connection ||= ApnsKit::Client.development(get_certificate, pool_size: 1, heartbeat_interval: 60)
        end

        def debug_production_connection
            @debug_production_connection ||= ApnsKit::Client.production(get_debug_certificate, pool_size: 1, heartbeat_interval: 60)
        end

        def debug_development_connection
            @debug_development_connection ||= ApnsKit::Client.development(get_debug_certificate, pool_size: 1, heartbeat_interval: 60)
        end

        def get_certificate
            @certificate ||= -> {
                cert_data = File.read(Rails.configuration.rover["certificate"])
                return ApnsKit::Certificate.from_p12_file(cert_data, Rails.configuration.rover["passphrase"])
            }.call
        end

        def get_debug_certificate
            @debug_certificate ||= -> {
                cert_data = File.read(Rails.configuration.rover["debug_certificate"])
                return ApnsKit::Certificate.from_p12_file(cert_data, Rails.configuration.rover["debug_passphrase"])
            }.call
        end
    end

end
