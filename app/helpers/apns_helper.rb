module ApnsHelper

    class << self

        def send(apns_app, messages_by_token)
            return [] if messages_by_token.empty?
            certificate = ApnsKit::Certificate.from_p12_file(apns_app.certificate, apns_app.passphrase)
            client = ApnsKit::Client.production(certificate, pool_size: 1, heartbeat_interval: 0)

            notifications = messages_to_notifications(messages_by_token)
            
            responses = send_with_connection(client, notifications)
            expired_tokens = responses.select{ |response| response.invalid_token? }.map{ |response| response.notification.token }

            client.shutdown

            return expired_tokens
        end

        def messages_to_notifications(messages_by_token)
            notifications = []
            messages_by_token.each do |token, messages|
                messages.each do |message|
                    payload = payload_from_message(message)
                    notifications.push(ApnsKit::Notification.new(token: device.token, sound: message.ios_sound_file, alert: { title: message.ios_title, body: message.notification_text }, data: payload ))
                end
            end
        end

        def connection_from_ios_platform(ios_platform, opts = {})
            return nil if ios_platform.certificate.nil?
            certificate = ApnsKit::Certificate.from_p12_file(ios_platform.certificate, ios_platform.passphrase)
            client = ApnsKit::Client.production(certificate, opts)
            return client
        end

        def send_with_connection(connection, notifications)
            return connection.send(notifications)
        end

        private

        def payload_from_message(inbox_message)
            json = V1::MessageSerializer.serialize(inbox_message)
            json[:attributes].delete(:"landing-page")
            json
            # { "message-id" => inbox_message.id.to_s }
        end

    end

end
