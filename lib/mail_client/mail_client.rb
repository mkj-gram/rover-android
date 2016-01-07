module MailClient

    class ConfigurationError < Exception
    end

    def self.send(msg)
        connection_pool.with do |conn|
            conn.send_message(@@domain, msg)
        end
    end

    private

    def self.set_default_domain(domain)
        @@domain = domain
    end

    def self.connection_pool
        @@connection_pool ||= ConnectionPool.new(size: 5, timeout: 5) {
            config = Rails.configuration.mailgun
            api_key = config["api_key"] || ""
            domain = config["api_url"] || ""
            set_default_domain(domain)
            Mailgun::Client.new(api_key)
        }
    end

end
