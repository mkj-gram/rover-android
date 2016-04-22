module ApnsHelper

    class << self

        def send(apns_app, message_by_token, devices)
            return [] if devices.nil? || devices.empty?
            certificate = ApnsKit::Certificate.new(apns_app.certificate, apns_app.passphrase)
            client = ApnsKit::Client.production(certificate, pool_size: 1, heartbeat_interval: 0)

            notifications = devices.map do |device|
                message = message_by_token[device.token]
                payload = payload_from_message(message)
                ApnsKit::Notification.new(token: device.token, sound: message.ios_sound_file, alert: { title: message.ios_title, body: message.notification_text }, data: payload)
            end

            responses = client.send(notifications)
            expired_tokens = responses.select{ |response| response.invalid_token? }.map{ |response| response.notification.token }

            client.shutdown

            return expired_tokens
        end

        private

        def payload_from_message(inbox_message)
            V1::MessageSerializer.serialize(inbox_message)
        end

    end

end
