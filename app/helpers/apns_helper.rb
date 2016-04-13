module ApnsHelper

    class << self

        # def send(devices, notification, opts = {})
        #     return [] if devices.nil? || devices.empty?
        #     # split devices by test_device
        #     development_devices, production_devices = devices.partition(&:test_device)

        #     development_notifications = development_devices.map do |device|
        #         notification = Houston::Notification.new(device: device.token)
        #         notification
        #     end

        #     production_notifications = production_notifications.map do |device|
        #         notification = Houston::Notification.new(device: device.token)
        #         notification
        #     end

        #     development_client.push(development_notifications)
        #     production_client.push(production_notifications)

        #     client.push(client_notifcations)
        #     failed_notifications = client_notifcations.select{|notification| notification.error }
        #     unsent_notifcations = client_notifcations.select{|notification| notification.error.nil? && !notification.sent? }
        #     return (failed_notifications + send(unsent_notifcations, notification_text, opts)).flatten
        # end
        def send(apns_app, notification, devices)
            return [] if devices.nil? || devices.empty?

            development_devices, production_devices = devices.partition(&:development_device?)

            development_notifications = development_devices.map do |device|
                Lowdown::Notification.new(:token => device.token, :payload => { :alert => "Hello World!" })
            end

            production_notifications = production_devices.map do |device|
                Lowdown::Notification.new(:token => device.token, :payload => { :alert => "Hello World!" })
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

    end

end
