module ApnsHelper

    class << self

        def send(apns_app, inbox_messages_by_token, devices)
            return [] if devices.nil? || devices.empty?

            development_devices, production_devices = devices.partition(&:development_device?)

            development_notifications = development_devices.map do |device|
                Lowdown::Notification.new(:token => device.token, :payload => payload_from_inbox_message(inbox_messages_by_token[device.token]))
            end

            production_notifications = production_devices.map do |device|
                Lowdown::Notification.new(:token => device.token, :payload => payload_from_inbox_message(inbox_messages_by_token[device.token]))
            end

            certificate = Lowdown::Certificate.from_pem_data(apns_app.certificate, apns_app.passphrase)
            development_client = Lowdown::Client.production(false, certificate: certificate, keep_alive: false)
            production_client = Lowdown::Client.production(true, certificate: certificate, keep_alive: false)

            expired_token = []
            expired_tokens += send_with_client(development_client, development_notifications)
            expired_tokens += send_with_client(production_client, production_notifications)
            return expired_tokens
        end

        private

        def send_with_client(client, notifications)
            return [] if notifications.empty?
            expired_tokens = []
            client.connect do |group|
                notifications.each do |notification|
                    group.send_notification(notification) do |response|
                        puts response
                        if response.invalid_token? || response.inactive_token?
                            expired_tokens.push(notification.token)
                        end
                    end
                end
            end
            return expired_tokens
        end

        def payload_from_inbox_message(inbox_message)
            {
                data: V1::InboxMessageSerializer.serialize(inbox_message),
                "content-available" => 1
            }
        end

    end

end
