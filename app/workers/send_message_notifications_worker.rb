class SendMessageNotificationWorker
    include BackgroundWorker::Worker

    from_queue 'send_message_notifications',
        :prefetch => 15,
        :ack => true

    class << self
        def perform_async(customer, messages = [], device_ids_filter = [])
            return if customer.nil? || messages.empty?

            serialized_messages = messages.map(&:to_doc)
            msg = {
                customer: customer.to_doc,
                serialized_messages: serialized_messages,
                device_ids_filter: device_ids_filter
            }

            enqueue_message(msg, {to_queue: 'send_message_notifications'})
        end
    end

    def perform(args)

        # customer_id = args["customer_id"]
        serialized_messages = args["serialized_messages"]
        device_ids_filter = args["device_ids_filter"]
        customer = Customer.from_document(args["customer"])
       
       
        messages = serialized_messages.map{|message| Message.from_document(message)}

        send_ios_notifications_to_customer(customer, messages, device_ids_filter)
        send_android_notifications_to_customer(customer, messages, device_ids_filter)

        ack!
    end

    def send_ios_notifications_to_customer(customer, messages, device_ids_filter)

        ios_devices = customer.devices.select { |device| device.os_name == "iOS" && !device.token.nil? }
        ios_devices.select! { |device| device_ids_filter.include? (device.id) } if device_ids_filter

        rover_devices, ios_devices = ios_devices.partition { |device| device.app_identifier == "io.rover.Rover" }

        if rover_devices.any?
            rover_development_devices, rover_production_devices = rover_devices.partition { |device| device.development == true }

            if rover_development_devices.any?
                send_ios_notifications_with_connection(RoverApnsHelper.production_connection, messages, rover_development_devices)
            end

            if rover_production_devices.any?
                send_ios_notifications_with_connection(RoverApnsHelper.development_connection, messages, rover_production_devices)
            end
            
        end

        if ios_devices.any?
            ios_development_devices, ios_production_devices = ios_devices.partition { |device| device.development == true }

            if ios_development_devices.any?
                PushConnectionCache.with_apns_connection(customer.account_id, development: true) do |connection_context|
                    if connection_context && connection_context[:connection]
                        send_ios_notifications_with_connection(connection_context[:connection], messages, ios_devices)
                    end
                end
            end

            if ios_production_devices.any?
                PushConnectionCache.with_apns_connection(customer.account_id) do |connection_context|
                    if connection_context && connection_context[:connection]
                        send_ios_notifications_with_connection(connection_context[:connection], messages, ios_devices)
                    end
                end
            end
        end
    end

    def send_ios_notifications_with_connection(connection, messages, devices)
        return if connection.nil?
        return if messages.nil?
        return if devices.nil?

        messages_by_token = devices.inject({}) { |hash, device| hash.merge!(device.token => messages); hash }

        notifications = ApnsHelper.messages_to_notifications(messages_by_token)

        start_time = Time.now
        responses = ApnsHelper.send_with_connection(connection, notifications)
        duration = (Time.now - start_time) * 1000.0

        responses.each do |response|
            device = devices.find { |device| device.token == response.notification.token }
            next if device.nil?
            customer = device.customer
            next if customer.nil?
            message = messages.find { |message| message.id == response.notification.custom_data.dig(:data, :id) }
            next if message.nil?

            input = {
                message: message
            }

            extra = {
                device: device,
                customer: customer,
                account_id: customer.account_id
            }

            if response.success?
                event = Events::Pipeline.build("notification", "sent", input, extra)
                event.raw_input = nil
                event.save
            else
                input.merge!(errors: [ response.failure_reason ])
                event = Events::Pipeline.build("notification", "failed", input, extra)
                event.raw_input = nil
                event.save
            end
        end


        expired_tokens = responses.select{ |response| response.invalid_token? }.map{ |response| response.notification.token }

        CustomerDeviceHelper.remove_tokens(expired_tokens)

        MetricsClient.aggregate("apns.notifications.sent" => { value: responses.size })
        MetricsClient.aggregate("apns.notifications.sent.time" => { value: (duration/responses.size.to_f).round(1) })
        Rails.logger.info(responses)
    end

    def send_android_notifications_to_customer(customer, messages, device_ids_filter)
        
        android_devices = customer.devices.select { |device| device.os_name == "Android" && device.token  }
        android_devices.select! { | device| device_ids_filter.include?(device.id) } if device_ids_filter

        return if android_devices.empty?

        android_messages_by_token = android_devices.inject({}) { |hash, device| hash.merge!(device.token => messages)}

        notifications = FcmHelper.messages_to_notifications(android_messages_by_token)

        expired_tokens = []
        duration = 0.0
        PushConnectionCache.with_fcm_connection(customer.account_id) do |connection_context|
            return if connection_context.nil? || connection_context[:connection].nil?
            start_time = Time.zone.now
            # TODO check to see what the response was for each notification and track the event sent
            expired_tokens = FcmHelper.send_with_connection(connection_context[:connection], notifications)
            duration = (Time.zone.now - start_time) * 1000.0
        end

        CustomerDeviceHelper.remove_tokens(expired_tokens)

        MetricsClient.aggregate("fcm.notifications.sent" => { value: android_devices.size })
        MetricsClient.aggregate("fcm.notifications.sent.time" => { value: (duration/android_devices.size.to_f).round(1) })

    end

end
