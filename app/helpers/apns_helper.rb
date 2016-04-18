module ApnsHelper

    class << self

        def send(apns_app, inbox_messages_by_token, devices)
            return [] if devices.nil? || devices.empty?
            certificate = ApnsKit::Certificate.new(apns_app.certificate, apns_app.passphrase)
            client = ApnsKit::Client.production(certificate, pool_size: 1, heartbeat_interval: 0)

            notifications = devices.map do |device|
                ApnsKit::Notification.new(token: device.token, content_available: true, data: payload_from_inbox_message(inbox_messages_by_token[device.token]))
            end

            responses = client.send(notifications)
            expired_tokens = responses.select{ |response| response.invalid_token? }.map{ |response| response.notification.token }

            client.shutdown

            return expired_tokens
        end

        private

        def payload_from_inbox_message(inbox_message)
            V1::InboxMessageSerializer.serialize(inbox_message)
        end

    end

end
