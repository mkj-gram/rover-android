module RoverApnsHelper

    class Restarter

        def initialize(expires_in = 300)
            
            @expires_in = expires_in
            @expires_at = Time.zone.now
            return self
        end

        def on_init(&block)
            @initblock = block
        end

        def on_reset(&block)
            @resetblock = block
        end

        def get
            if @expires_at < Time.zone.now
                reset
            end

            return @data
        end


        private

        def reset

            if @initblock.nil?
                return
            end

            @old_data = @data
            @data = @initblock.call

            if @resetblock
                @resetblock.call(@old_data, @data)
            end

            @expires_at = Time.zone.now + @expires_in
        end

    end

    class << self

        def init_connection(cert, development = false)
            reseter = Restarter.new
            reseter.on_init do
                if development == true
                    ApnsKit::Client.development(cert, pool_size: 1, heartbeat_interval: 60)
                else
                    ApnsKit::Client.production(cert, pool_size: 1, heartbeat_interval: 60)
                end
            end

            reseter.on_reset do |old_connection, new_connection|
                begin
                    if !old_connection.nil?
                        old_connection.shutdown
                    end
                rescue Exception => e
                    puts e
                end
            end

            return reseter
        end

        def production_connection
            @production_connection ||= init_connection(get_certificate, false)
            return @production_connection.get
        end

        def development_connection
            @development_connection ||= init_connection(get_certificate, true)
            return @development_connection.get
        end

        def debug_production_connection
            @debug_production_connection ||= init_connection(get_debug_certificate, false)
            return @debug_production_connection.get
        end

        def debug_development_connection
            @debug_development_connection ||= init_connection(get_debug_certificate, true)
            return @debug_development_connection.get
        end

        def inbox_production_connection
            @inbox_production_connection ||= init_connection(get_inbox_certificate, false)
            return @inbox_production_connection.get
        end

        def inbox_development_connection
            @inbox_development_connection ||= init_connection(get_inbox_certificate, true)
            return @inbox_development_connection.get
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

        def get_inbox_certificate
            @inbox_certificate ||= -> {
                cert_data = File.read(Rails.configuration.rover["inbox_certificate"])
                return ApnsKit::Certificate.from_p12_file(cert_data, Rails.configuration.rover["inbox_passphrase"])
            }.call
        end
    end

end
