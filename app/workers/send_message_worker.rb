require 'expired_token_helper'
require 'apns_helper'
require 'gcm_helper'

class SendMessageWorker
    include BackgroundWorker::Worker

    from_queue 'send_message'


    def self.perform_async(account, message, scroll_id = nil, offset = nil, test_message = false)
        account_id = account.is_a?(Account) ? account.id : account
        message_id = message.is_a?(Message) ? message.id : message
        msg = {
            account_id: account_id,
            message_id: message_id,
            scroll_id: nil,
            offset: 0,
            test_message: test_message
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

        if scroll_id
            begin
                response = client.scroll(scroll: '5m', scroll_id: scroll_id)
            rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
                Rails.logger.warn(e)
                response = client.search(index: ::Customer.get_index_name(account_id), scroll: '5m', body: segment_query.merge(size: SendMessageWorker.batch_size, from: offset))
            end
        else
            response = client.search(index: ::Customer.get_index_name(account_id), scroll: '5m', body: segment_query.merge(size: SendMessageWorker.batch_size)})
        end


        if response && response["hits"]["hits"].any?
            # perform the next scroll
            perform_next_scroll(account, message, response["_scroll_id"], offset + response["hits"]["hits"].size, test_message)

            # we need to check if the message is within global limits if no limits exist we can just blast through them
            # performance degrades as we add more limits
            # very taxing on redis, somehow need a batch call
            #
            # we need to loop through all customers
            # do we convert to customer objects?
            # convert results to customer and customer devices
            customers = response["hits"]["hits"].map do |document|
                source = document["_source"]
                customer = Customer.new(source)
            end


            if test_message == false && account.message_limits.any?
                customers = customers.select{|customer| MessageRateLimit.add_global_message(customer, account.message_limits)}
            end

            # log message delivered
            customers.each do |customer|
                event = Events::Pipeline.build("message", "delivered", {account: account, customer: customer, device: customer.devices.first, message: message})
                event.save
            end

            # map to devices
            devices = customers.map(&:devices).flatten
            send_push_notification(account, message, devices)
        end

        ack!
    end




    private

    def perform_next_scroll(account, message, scroll_id, offset, test_message = false)
        SendMessageWorker.perform_async(account, message, scroll_id, offset, test_message)
    end

    def client
        @client ||= Elasticsearch::Model.client
    end


    def send_push_notification(account, message, devices)
        apns_app = account.ios_platform
        gcm_app = account.android_platform

        if apns_app
            apns_devices = devices.select(&:apns_device?)
            apns_devices_by_token = apns_devices.index_by(&:token)
            expired_tokens = send_apns_notification(apns_app, apns_devices, notification_text)
            expired_devices = expired_tokens.collect{|token| apns_devices_by_token[token]}
            ExpiredTokenHelper.expire_devices(expired_devices)
        end

        if gcm_app
            gcm_devices = devices.select(&:gcm_device?)
            gcm_devices_by_token = gcm_devices.index_by(&:token)
            expired_tokens = send_gcm_notification(gcm_app, gcm_devices, notification_text)
            expired_devices = expired_tokens.collect{|token| gcm_devices_by_token[token]}
            ExpiredTokenHelper.expire_devices(expired_devices)
        end

    end

    def send_apns_notification(apns_app, devices, notification_text)
        # split devices by 1000
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_tokens += ApnsHelper.send(apns_app, notification, devices)
        end
        return expired_tokens
    end

    def send_gcm_notification(gcm_app, devices, notification_text)
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_token += GcmHelper.send(gcm_app, notification, devices)
        end
        return expired_tokens
    end

end
