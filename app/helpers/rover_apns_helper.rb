module RoverApnsHelper

	class << self

		def get_connection
            @connection ||= ApnsKit::Client.production(get_certificate, pool_size: 1, heartbeat_interval: 60)
		end

		def get_certificate
			@certificate ||= -> {
				cert_data = File.read(Rails.configuration.rover["certificate"])
				return ApnsKit::Certificate.from_p12_file(cert_data, Rails.configuration.rover["passphrase"])
			}.call
		end
	end

end
