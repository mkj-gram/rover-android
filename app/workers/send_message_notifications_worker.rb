class SendMessageNotificationWorker
    include BackgroundWorker::Worker

    from_queue 'send_message_notifications',
        :prefetch => 15,
        :ack => true


    def self.perform_async(customer_id, message_ids = [], device_ids_filter = [])
        return if customer_id.nil? || message_ids.empty?

        msg = {
            customer_id: customer_id,
            message_ids: message_ids,
            device_ids_filter: device_ids_filter
        }

        enqueue_message(msg, {to_queue: 'send_message_notifications'})
    end

    def perform(args)
        customer_id = args["customer_id"]
        message_ids = args["message_ids"]
        device_ids_filter = args["device_ids_filter"]

        customer = Customer.find(customer_id)
        messages = Message.find_all(message_ids)
        ios_platform = IosPlatform.find(customer.account_id)

        if ios_platform
            ios_devices = customer.devices.select { |device| device.os_name == "iOS" && device.remote_notifications_enabled }
            ios_devices.select! { |device| device_ids_filter.include? (device.id) } if device_ids_filter

            message_ids_by_token = ios_devices.inject({}) { |hash, device| hash.merge!(device.token => messages); hash }

            # TODO
            # setup long lived connections for these
            expired_tokens = ApnsHelper.send(ios_platform, message_ids_by_token, ios_devices)

            # need a way to specify the device without updating the customer
            # TODO:!!!!!!
            # if expired_tokens && expired_tokens.any?
            #     expired_devices = ios_devices.select { |device| expired_tokens.include?(expired_tokens) }
            #     expired_devices.each do |device|
            #         device.update_attributes()
            #     end
            # end
        end

        ack!
    end

end
