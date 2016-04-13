require 'expired_token_helper'
require 'apns_helper'
require 'gcm_helper'

class SendMessageWorker
    include BackgroundWorker::Worker

    from_queue 'send_message'


    def self.perform_async(account, message, scroll_id = nil, offset = nil, test_message = false, test_customer_ids = nil)
        account_id = account.is_a?(Account) ? account.id : account
        message_id = message.is_a?(Message) ? message.id : message
        msg = {
            account_id: account_id,
            message_id: message_id,
            scroll_id: nil,
            offset: 0,
            test_message: test_message,
            test_device_ids: test_device_ids
        }.to_json
        # using scroll api
        enqueue_message(msg, {to_queue: 'send_message'})
    end

    def self.batch_size
        500
    end

    def work(msg)
        msg = JSON.parse(msg)

        account = Account.find(msg["account_id"])
        message = Message.find(msg["message_id"])

        scroll_id = msg["scroll_id"]
        offset = msg["offset"]
        test_message = msg["test_message"]
        test_customer_ids = msg["test_customer_ids"]

        # if test_customers are passed in then we only want to select them
        if test_customer_ids
            customers = Customer.find(test_customer_ids).all
        else
            if scroll_id
                begin
                    response = client.scroll(scroll: '5m', scroll_id: scroll_id)
                rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
                    Rails.logger.warn(e)
                    response = client.search(index: ::Customer.get_index_name(account), scroll: '5m', body: message.customer_segment.to_elasticsearch_query.merge(size: SendMessageWorker.batch_size, from: offset))
                end
            else
                response = client.search(index: ::Customer.get_index_name(account), scroll: '5m', body: message.customer_segment.to_elasticsearch_query.merge(size: SendMessageWorker.batch_size))
            end


            if response && response["hits"]["hits"].any?
                # perform the next scroll we
                perform_next_scroll(account, message, response["_scroll_id"], offset + response["hits"]["hits"].size, test_message)

                customers = response["hits"]["hits"].map do |document|
                    source = document["_source"]
                    customer = Customer.new(source)
                end
            else
                customers = []
            end
        end


        if test_message == false && account.message_limits.any?
            customers = customers.select{|customer| MessageRateLimit.add_global_message(customer, account.message_limits)}
        end

        if message.save_to_inbox
            customers.each do |customer|
                inbox_message = message.to_inbox_message(customer: customer, device: customer.devices.first)
                # Use the write only method
                # Speeds up because we don't need to read the model first
                CustomerInbox.add_messages(customer.id, [inbox_message])
            end
        end

        # log message delivered
        customers.each do |customer|
            event = Events::Pipeline.build("message", "delivered", {account: account, customer: customer, device: customer.devices.first, message: message})
            event.save
        end
        # need to loop through and create inbox messages for each device
        # {token => inbox_message}
        # map to pushable devices
        inbox_messages_by_token = {}
        devices = []
        customers.each do |customer|
            pushable_devices = customer.devices.select{|device| !device.token.nil? }
            if pushable_devices.any?
                pushable_devices.each do |device|
                    inbox_messages_by_token[device.token] = message.to_inbox_message(customer: customer, device: device)
                end
                devices.push(*pushable_devices)
            end
        end

        send_push_notification(account, inbox_messages_by_token, devices)

        ack!
    end




    private

    def perform_next_scroll(account, message, scroll_id, offset, test_message = false)
        SendMessageWorker.perform_async(account, message, scroll_id, offset, test_message)
    end

    def client
        @client ||= Elasticsearch::Model.client
    end


    def send_push_notification(account, inbox_messages_by_token, devices)
        apns_app = account.ios_platform
        gcm_app = account.android_platform

        if apns_app
            apns_devices = devices.select(&:apns_device?)
            apns_devices_by_token = apns_devices.index_by(&:token)
            expired_tokens = send_apns_notification(apns_app, inbox_messages_by_token, apns_devices)
            expired_devices = expired_tokens.collect{|token| apns_devices_by_token[token]}
            ExpiredTokenHelper.expire_devices(expired_devices)
        end

        if gcm_app
            gcm_devices = devices.select(&:gcm_device?)
            gcm_devices_by_token = gcm_devices.index_by(&:token)
            expired_tokens = send_gcm_notification(gcm_app, inbox_messages_by_token, gcm_devices)
            expired_devices = expired_tokens.collect{|token| gcm_devices_by_token[token]}
            ExpiredTokenHelper.expire_devices(expired_devices)
        end

    end

    def send_apns_notification(apns_app, message, devices)
        # split devices by 1000
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_tokens += ApnsHelper.send(apns_app, message, devices)
        end
        return expired_tokens
    end

    def send_gcm_notification(gcm_app, message, devices)
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_token += GcmHelper.send(gcm_app, message, devices)
        end
        return expired_tokens
    end

end
