class SendMessageNotificationWorker
    include BackgroundWorker::Worker

    from_queue 'send_message_notifications',
        :prefetch => 15,
        :ack => true

    class << self
        def perform_async(customer_id, messages = [], device_ids_filter = [])
            return if customer_id.nil? || messages.empty?

            serialized_messages = messages.map(&:to_doc)
            msg = {
                customer_id: customer_id,
                serialized_messages: serialized_messages,
                device_ids_filter: device_ids_filter
            }

            enqueue_message(msg, {to_queue: 'send_message_notifications'})
        end

        def ios_connection_pool
            @@ios_connection_pool
        end
    end

    class ApnsLongTermConnectionPool

        # defaults to 10 active connections
        def initialize(size: 10)
            Rails.logger.info("Initializing connection pool of size #{size}")
            @size = size
            @connections = {}
            @mutex = Mutex.new
            @last_id = nil
        end


        def get(id)
            @mutex.synchronize do
                @connections[id]
            end
        end

        def add(id, connection)
            if @connections.size > @size
                remove(@connections.keys.last)
            end

            @mutex.synchronize do
                Rails.logger.info("Adding connection with id #{id}")
                @connections[id] = connection
            end
        end

        def remove(id)
            @mutex.synchronize do
                Rails.logger.info("Removing connection with id #{id}")
                connection = @connections[id]
                connection.shutdown if connection
                connection = nil
                @connections.delete(id)
            end
        end
    end

    @@ios_connection_pool = ApnsLongTermConnectionPool.new(size: 20)
    @@android_api_key_cache = ActiveSupport::Cache::MemoryStore.new

    def perform(args)
        customer_id = args["customer_id"]
        serialized_messages = args["serialized_messages"]
        device_ids_filter = args["device_ids_filter"]

        customer = Customer.find(customer_id)
        messages = serialized_messages.map{|message| Message.from_document(message)}

        send_ios_notifications_to_customer(customer, messages, device_ids_filter)
        send_android_notifications_to_customer(customer, messages, device_ids_filter)




        # ios_platform = IosPlatform.find(customer.account_id)

        # if ios_platform


        #     connection = connection_from_ios_platform(ios_platform)
        #     notifications =

        #         # TODO
        #         # setup long lived connections for these
        #         expired_tokens = ApnsHelper.send(ios_platform, message_ids_by_token, ios_devices)

        #     # need a way to specify the device without updating the customer
        #     # TODO:!!!!!!
        #     # if expired_tokens && expired_tokens.any?
        #     #     expired_devices = ios_devices.select { |device| expired_tokens.include?(expired_tokens) }
        #     #     expired_devices.each do |device|
        #     #         device.update_attributes()
        #     #     end
        #     # end
        # end

        ack!
    end

    def send_ios_notifications_to_customer(customer, messages, device_ids_filter)
        if @@ios_connection_pool.get(customer.account_id).nil?
            ios_platform = IosPlatform.find_by(account_id: customer.account_id)
            return if ios_platform.nil?
            connection = ApnsHelper.connection_from_ios_platform(ios_platform, pool_size: 1, heartbeat_interval: 120)
            @@ios_connection_pool.add(customer.account_id, connection)
        end

        ios_devices = customer.devices.select { |device| device.os_name == "iOS" && device.remote_notifications_enabled }
        ios_devices.select! { |device| device_ids_filter.include? (device.id) } if device_ids_filter

        messages_by_token = ios_devices.inject({}) { |hash, device| hash.merge!(device.token => messages); hash }

        connection = @@ios_connection_pool.get(customer.account_id)

        notifications = ApnsHelper.messages_to_notifications(messages_by_token)

        start_time = Time.now
        responses = ApnsHelper.send_with_connection(connection, notifications)
        duration = (Time.now - start_time) * 1000.0

        MetricsClient.aggregate("apns_notification.sent" => { value: responses.size })
        MetricsClient.aggregate("apns_notification.sent.time" => { value: (duration/responses.size.to_f).round(1) })
        Rails.logger.info(responses)
    end

    def send_android_notifications_to_customer(customer, messages, device_ids_filter)

        api_key = @@android_api_key_cache.fetch(customer.account_id, expires_in: 10.minutes) do
            android_platform = AndroidPlatform.find_by(account_id: customer.account_id)
            if android_platform
                android_platform.api_key
            else
                nil
            end
        end

        return if api_key.nil?

        android_devices = customer.devices.select { |device| device.os_name == "Android" && device.token  }
        android_devices.select! { | device| device_ids_filter.include?(device.id) } if device_ids_filter

        return if android_devices.empty?

        android_messages_by_token = android_devices.inject({}) { |hash, device| hash.merge!(device.token => messages)}

        notifications = FcmHelper.messages_to_notifications(android_messages_by_token)
        connection = FCM.new(api_key)

        start_time = Time.zone.now
        FcmHelper.send_with_connection(connection, notifications)
        duration = (Time.zone.now - start_time) * 1000.0

        MetricsClient.aggregate("fcm_notification.sent" => { value: android_devices.size })
        MetricsClient.aggregate("fcm_notification.sent.time" => { value: (duration/android_devices.size.to_f).round(1) })

    end

end
