class SendMessageNotificationWorker
    include BackgroundWorker::Worker

    from_queue 'send_message_notifications',
        :prefetch => 15,
        :ack => true

    class << self
        def perform_async(customer_id, message_ids = [], device_ids_filter = [])
            return if customer_id.nil? || message_ids.empty?

            msg = {
                customer_id: customer_id,
                message_ids: message_ids,
                device_ids_filter: device_ids_filter
            }

            enqueue_message(msg, {to_queue: 'send_message_notifications'})
        end

        def connection_pool
            @@connection_pool
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

    @@connection_pool = ApnsLongTermConnectionPool.new(size: 20)

    def perform(args)
        customer_id = args["customer_id"]
        message_ids = args["message_ids"]
        device_ids_filter = args["device_ids_filter"]

        customer = Customer.find(customer_id)
        messages = Message.find_all(message_ids)

        if @@connection_pool.get(customer.account_id).nil?
            ios_platform = IosPlatform.find(customer.account_id)
            return ack! if ios_platform.nil?
            connection = ApnsHelper.connection_from_ios_platform(ios_platform, pool_size: 1, heartbeat_interval: 120)
            @@connection_pool.add(customer.account_id, connection)
        end

        ios_devices = customer.devices.select { |device| device.os_name == "iOS" && device.remote_notifications_enabled }
        ios_devices.select! { |device| device_ids_filter.include? (device.id) } if device_ids_filter

        messages_by_token = ios_devices.inject({}) { |hash, device| hash.merge!(device.token => messages); hash }

        connection = @@connection_pool.get(customer.account_id)

        notifications = ApnsHelper.messages_to_notifications(messages_by_token)

        start_time = Time.now
        responses = ApnsHelper.send_with_connection(connection, notifications)
        duration = (Time.now - start_time) * 1000.0

        MetricsClient.aggregate("apns_notification.sent" => { value: responses.size })
        MetricsClient.aggregate("apns_notification.sent.time" => { value: (duration/responses.size.to_f).round(1) })
        Rails.logger.info(responses)

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

end
