require 'expired_token_helper'
require 'apns_helper'
require 'gcm_helper'

class SendMessageWorker
    include BackgroundWorker::Worker

    from_queue 'send_message',
        :prefetch => 1,
        :ack => true

    def self.perform_async(message_id, segment_query = nil, test_customer_ids = [], scroll_id = nil, offset = 0)

        if segment_query.nil?
            message = Message.find(message_id)
            if message.customer_segment
                segment_query = message.customer_segment.to_elasticsearch_query
            else
                segment_query = {}
            end
        end

        msg = {
            message_id: message_id,
            segment_query: segment_query,
            test_customer_ids: test_customer_ids,
            scroll_id: scroll_id,
            offset: offset
        }

        enqueue_message(msg, {to_queue: 'send_message'})
    end

    def self.batch_size
        500
    end


    def work(args)
        args = JSON.load(args).with_indifferent_access
        puts args
        message_id = args[:message_id]
        segment_query = args[:segment_query]
        test_customer_ids = args[:test_customer_ids]
        scroll_id = args[:scroll_id]
        offset = args[:offset]
        test_message = !test_customer_ids.nil? && test_customer_ids.any?

        message = Message.find(message_id)
        account = message.account

        ##################################################################
        #                                                                #
        #           Grab all customers who fit the criteria              #
        #                                                                #
        ##################################################################

        if test_customer_ids.any?
            customers = Customer.find(test_customer_ids).all
        else
            if scroll_id
                Sneakers.logger.info("Found scroll_id #{scroll_id}")
                begin
                    response = client.scroll(scroll: '5m', scroll_id: scroll_id)
                rescue Elasticsearch::Transport::Transport::Errors::NotFound => e
                    Rails.logger.warn(e)
                    response = client.search(index: ::Customer.get_index_name(account), scroll: '5m', body: segment_query.merge(size: SendMessageWorker.batch_size, from: offset))
                end
            else
                Sneakers.logger.info("Performing search with #{segment_query}")
                response = client.search(index: ::Customer.get_index_name(account), scroll: '5m', body: segment_query.merge(size: SendMessageWorker.batch_size))
            end


            if response && response["hits"]["hits"].any?
                Sneakers.logger.info("Got response of #{response['hits']['hits'].size}")
                # perform the next scroll we
                # perform_next_scroll(message_id, segment_query, test_customer_ids, response["_scroll_id"], offset + response["hits"]["hits"].size)

                customers = response["hits"]["hits"].map do |document|
                    source = document["_source"]
                    customer = Customer.new(source)
                end
            else
                Sneakers.logger.info("No customers found")
                customers = []
                ack!
            end
        end


        ##################################################################
        #                                                                #
        #           Add rate limits and add to inbox if needed           #
        #                                                                #
        ##################################################################

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


        ##################################################################
        #                                                                #
        #         Record message delivered event for all customers       #
        #                                                                #
        ##################################################################

        customers.each do |customer|
            event = Events::Pipeline.build("message", "delivered", {account: account, customer: customer, device: customer.devices.first, message: message})
            event.save
        end


        ##################################################################
        #                                                                #
        #     Generate the notification based on customer and device     #
        #                                                                #
        ##################################################################

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

    def perform_next_scroll(message_id, segment_query = nil, test_customer_ids = [], scroll_id = nil, offset = 0)
        SendMessageWorker.perform_async(message_id, segment_query, test_customer_ids, scroll_id, offset)
    end

    def client
        @client ||= Elasticsearch::Model.client
    end


    def send_push_notification(account, inbox_messages_by_token, devices)
        Sneakers.logger.info("Sending #{devices.size} notifications")
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

    def send_apns_notification(apns_app, inbox_messages_by_token, devices)
        # split devices by 1000
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            Sneakers.logger.info("Sending #{devices.size} ios devices")
            expired_tokens += ApnsHelper.send(apns_app, inbox_messages_by_token, devices)
        end
        return expired_tokens
    end

    def send_gcm_notification(gcm_app, inbox_messages_by_token, devices)
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_token += GcmHelper.send(gcm_app, inbox_messages_by_token, devices)
        end
        return expired_tokens
    end

end
