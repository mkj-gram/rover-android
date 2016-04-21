class SendMessageWorker
    include BackgroundWorker::Worker

    from_queue 'send_message',
        :prefetch => 1,
        :ack => true

    def self.perform_async(message_template_id, segment_query = nil, test_customer_ids = [], scroll_id = nil, offset = 0)

        if segment_query.nil?
            message_template = MessageTemplate.find(message_template_id)
            if message_template.customer_segment
                segment_query = message_template.customer_segment.to_elasticsearch_query
            else
                segment_query = {}
            end
        end

        msg = {
            message_template_id: message_template_id,
            segment_query: segment_query,
            test_customer_ids: test_customer_ids,
            scroll_id: scroll_id,
            offset: offset
        }

        enqueue_message(msg, {to_queue: 'send_message'})
    end

    def self.batch_size
        1000
    end


    def perform(args)
        message_template_id = args[:message_template_id]
        segment_query = args[:segment_query]
        test_customer_ids = args[:test_customer_ids]
        scroll_id = args[:scroll_id]
        offset = args[:offset]
        test_message = !test_customer_ids.nil? && test_customer_ids.any?

        message_template = MessageTemplate.find(message_template_id)
        account = message_template.account

        ##################################################################
        #                                                                #
        #           Grab all customers who fit the criteria              #
        #                                                                #
        ##################################################################

        if test_customer_ids.any?
            customers = Customer.find(test_customer_ids)
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
                # perform the next scroll
                perform_next_scroll(message_template_id, segment_query, test_customer_ids, response["_scroll_id"], offset + response["hits"]["hits"].size)

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




        # TODO verify the uniqueness of this message being sent
        # Since this background job could re-run
        messages_by_inbox  = customers.inject({}) { |hash, customer|  hash.merge(customer.inbox => message_template.render_message(customer))}


        # we still have to save them temporarily
        if message_template.save_to_inbox == false
            current_time = Time.zone.now
            # we want the tmp messages to eventually expire
            bulk_write = Mongo::BulkWrite.new(Message.collection, messages_by_inbox.values.map {|message| {insert_one: message.attributes.merge("expire_at" => current_time + Message.temporary_message_expire_time)}}, ordered: false )
        else
            bulk_write = Mongo::BulkWrite.new(Message.collection, messages_by_inbox.values.map {|message| {insert_one: message.attributes}}, ordered: false )
        end

        Sneakers.logger.info("Saving #{messages_by_inbox.values.size} messages to inboxes")

        begin
            bulk_write.execute
        rescue Mongo::Error::BulkWriteError => result
            # result[Mongo::Error::WRITE_ERRORS].first['index']
            # only raised when dupicates exist
            Rails.logger.warn(e.results)
        end

        if message_template.save_to_inbox
            CustomerInbox.bulk_insert(messages_by_inbox)
        end


        ##################################################################
        #                                                                #
        #         Record message delivered event for all customers       #
        #                                                                #
        ##################################################################

        customers.each do |customer|
            event = Events::Pipeline.build("message", "delivered", {account: account, customer: customer, device: customer.devices.first, message_template: message_template})
            event.save
        end


        ##################################################################
        #                                                                #
        #     Generate the notification based on customer and device     #
        #                                                                #
        ##################################################################

        message_instance_by_token = {}
        devices = []
        messages_by_inbox.each do |inbox, message_instance|
            customer = inbox.customer
            pushable_devices = customer.devices.select{ |device| !device.token.nil? }
            if pushable_devices.any?
                pushable_devices.each do |device|
                    message_instance_by_token[device.token] = message_instance
                end
                devices += pushable_devices
            end
        end

        send_push_notification(account, message_instance_by_token, devices)

        ack!
    end

    private

    def perform_next_scroll(message_template_id, segment_query = nil, test_customer_ids = [], scroll_id = nil, offset = 0)
        SendMessageWorker.perform_async(message_template_id, segment_query, test_customer_ids, scroll_id, offset)
    end

    def client
        @client ||= Elasticsearch::Model.client
    end


    def send_push_notification(account, message_instance_by_token, devices)
        Sneakers.logger.info("Sending #{devices.size} notifications")
        apns_app = account.ios_platform
        gcm_app = account.android_platform

        if apns_app
            apns_devices = devices.select(&:apns_device?)
            apns_devices_by_token = apns_devices.index_by(&:token)
            expired_tokens = send_apns_notification(apns_app, message_instance_by_token, apns_devices)
            expired_devices = expired_tokens.collect{|token| apns_devices_by_token[token]}
            ExpiredTokenHelper.expire_devices(expired_devices)
        end

        if gcm_app
            gcm_devices = devices.select(&:gcm_device?)
            gcm_devices_by_token = gcm_devices.index_by(&:token)
            expired_tokens = send_gcm_notification(gcm_app, message_instance_by_token, gcm_devices)
            expired_devices = expired_tokens.collect{|token| gcm_devices_by_token[token]}
            ExpiredTokenHelper.expire_devices(expired_devices)
        end

    end

    def send_apns_notification(apns_app, message_instance_by_token, devices)
        # split devices by 1000
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_tokens += ApnsHelper.send(apns_app, message_instance_by_token, devices)
        end
        return expired_tokens
    end

    def send_gcm_notification(gcm_app, message_instance_by_token, devices)
        expired_tokens = []
        devices.each_slice(1000) do |devices|
            expired_tokens += GcmHelper.send(gcm_app, message_instance_by_token, devices)
        end
        return expired_tokens
    end

end
