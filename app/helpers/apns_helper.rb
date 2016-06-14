module ApnsHelper

    class << self

        def send(apns_app, messages_by_token, devices)
            return [] if devices.nil? || devices.empty?
            certificate = ApnsKit::Certificate.new(apns_app.certificate, apns_app.passphrase)
            client = ApnsKit::Client.production(certificate, pool_size: 1, heartbeat_interval: 0)

            notifications = []

            devices.each do |device|
                messages = messages_by_token[device.token]
                messages.each do |message|
                    payload = payload_from_message(message)
                    notifications.push(ApnsKit::Notification.new(token: device.token, sound: message.ios_sound_file, alert: { title: message.ios_title, body: message.notification_text }, data: payload))
                end
            end

            responses = client.send(notifications)
            expired_tokens = responses.select{ |response| response.invalid_token? }.map{ |response| response.notification.token }

            client.shutdown

            return expired_tokens
        end

        private

        def payload_from_message(inbox_message)
            { "message-id" => inbox_message.id.to_s }
        end

    end

end
