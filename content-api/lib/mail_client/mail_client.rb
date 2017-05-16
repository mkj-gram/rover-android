module MailClient

    class << self

        @test_mode = false

        def test_mode!
            @test_mode = true
        end

        def in_test_mode?
            @test_mode
        end

        def send(msg)
            if !in_test_mode?
                connection_pool.with do |conn|
                    conn.send_message(@domain, msg)
                end
            else
                Rails.logger.info("Skipping sending email #{msg} due to test mode enabled")
            end
        end

        private

        def connection_pool
            @connection_pool ||= ConnectionPool.new(size: 10, timeout: 5) {
                api_key = Rails.configuration.mailgun["api_key"]
                @domain = Rails.configuration.mailgun["api_url"]
                Mailgun::Client.new(api_key)
            }
        end
    end
end
