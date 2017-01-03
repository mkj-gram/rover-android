class SendMessageNotificationWorker
    include BackgroundWorker::Worker

    from_queue 'send_message_notifications',
        :prefetch => 15,
        :ack => true

    INVALID_REGISTRATION = "InvalidRegistration".freeze
    NOT_REGISTERED = "NotRegistered".freeze

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
        trigger_event_id = args["trigger_event_id"]
        trigger_arguments = args["trigger_arguments"]
       
        messages = serialized_messages.map{|message| Message.from_document(message)}

        send_ios_notifications_to_customer(customer, messages, device_ids_filter, trigger_event_id, trigger_arguments)
        send_android_notifications_to_customer(customer, messages, device_ids_filter, trigger_event_id, trigger_arguments)

        ack!
    end

    def get_production_connection_for(app_identifier)
        return if !block_given?

        case app_identifier
        when "io.rover.Rover"
            yield RoverApnsHelper.production_connection
        when "io.rover.debug"
            yield RoverApnsHelper.debug_production_connection
        when "ios.rover.Inbox"
            yield RoverApnsHelper.inbox_production_connection
        else
            PushConnectionCache.with_apns_connection(customer.account_id) do |connection_context|
                if connection_context && connection_context[:connection]
                    yield connection_context[:connection]
                else
                    yield nil
                end
            end
        end
    end

    def get_development_connection_for(app_identifier)
        return if !block_given?

        case app_identifier
        when "io.rover.Rover"
            yield RoverApnsHelper.development_connection
        when "io.rover.debug"
            yield RoverApnsHelper.debug_development_connection
        when "ios.rover.Inbox"
            yield RoverApnsHelper.inbox_development_connection
        else
            PushConnectionCache.with_apns_connection(customer.account_id, development: true) do |connection_context|
                if connection_context && connection_context[:connection]
                    yield connection_context[:connection]
                else
                    yield nil
                end
            end
        end
    end

    def send_ios_notifications_to_customer(customer, messages, device_ids_filter, trigger_event_id, trigger_arguments)

        ios_devices = customer.devices.select { |device| device.os_name == "iOS" && !device.token.nil? }
        ios_devices.select! { |device| device_ids_filter.include? (device.id) } if device_ids_filter

        grouped_devices_by_app_identifier = ios_devices.group_by { |device| device.app_identifier }

        grouped_devices_by_app_identifier.each do |app_identifier, devices|
            development_devices, production_devices = devices.partition { |device| device.development == true  }

            if development_devices.any?
                get_development_connection_for(app_identifier) do |connection|
                    if !connection.nil?
                        send_ios_notifications_with_connection(connection, messages, development_devices, trigger_event_id, trigger_arguments)
                    end
                end
            end

            if production_devices.any?
                get_production_connection_for(app_identifier) do |connection|
                    if !connection.nil?
                        send_ios_notifications_with_connection(connection, messages, production_devices, trigger_event_id, trigger_arguments)
                    end
                end
            end
        end
    end

    def send_ios_notifications_with_connection(connection, messages, devices, trigger_event_id, trigger_arguments)
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
                message: message,
                trigger_event_id: trigger_event_id
            }

            extra = {
                device: device,
                customer: customer,
                account_id: customer.account_id,
                trigger_arguments: trigger_arguments
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

    def send_android_notifications_to_customer(customer, messages, device_ids_filter, trigger_event_id, trigger_arguments)
        
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
            responses = FcmHelper.send_with_connection(connection_context[:connection], notifications)

            responses.each do |response|
                device = android_devices.find { |device| device.token == response[:token] }
                next if device.nil?
                customer = device.customer
                next if customer.nil?
                message = messages.find { |message| message.id == response.dig(:data, :message, :id) }
                next if message.nil?

                input = {
                    message: message,
                    trigger_event_id: trigger_event_id
                }

                extra = {
                    device: device,
                    customer: customer,
                    account_id: customer.account_id,
                    trigger_arguments: trigger_arguments
                }

                if response[:success]
                    event = Events::Pipeline.build("notification", "sent", input, extra)
                    event.raw_input = nil
                    event.save
                else
                    if response[:error] == INVALID_REGISTRATION || response[:error] == NOT_REGISTERED
                        expired_tokens.push(response[:token])
                    end
                    input.merge!(errors: [ response[:error] ])
                    event = Events::Pipeline.build("notification", "failed", input, extra)
                    event.raw_input = nil
                    event.save
                end
            end
            

            duration = (Time.zone.now - start_time) * 1000.0
        end

        CustomerDeviceHelper.remove_tokens(expired_tokens)

        MetricsClient.aggregate("fcm.notifications.sent" => { value: android_devices.size })
        MetricsClient.aggregate("fcm.notifications.sent.time" => { value: (duration/android_devices.size.to_f).round(1) })

    end

end
