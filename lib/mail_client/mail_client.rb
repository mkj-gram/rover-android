module MailClient

    class << self
        attr_accessor :domain

        def send(msg)
            connection_pool.with do |conn|
                conn.send_message(@domain, msg)
            end
        end

        private

        def connection_pool
            @connection_pool ||= ConnectionPool.new(size: 1, timeout: 5) {
                api_key = config["api_key"]
                @domain = config["api_url"]
                Mailgun::Client.new(api_key)
            }
        end
    end
end
