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

        if !test_message

            customers.each do |customer|
                event = Events::Pipeline.build("message", "delivered", {account: account, customer: customer, device: customer.devices.first, message_template: message_template, skip_message_stats: true})
                event.save
            end

            MessageTemplateStats.update_counters(message_template.id, total_delivered: customers.size)

        end


        ##################################################################
        #                                                                #
        #     Generate the notification based on customer and device     #
        #                                                                #
        ##################################################################

        # TODO
        # REWRITE THIS OLD CODE
        #
        messages_by_ios_token = {}
        messages_by_android_token = {}

        messages_by_inbox do |inbox, message|
            devices = customer.devices.select { |device| !device.token.nil? }
            devices.each do |device|
                if device.ios?
                    messages_by_ios_token[device.token] = message
                elsif device.android?
                    messages_by_android_token[device.token] = message
                end
            end
        end

        send_push_notification_for_ios_messages(account, messages_by_ios_token)

        send_push_notification_for_android_messages(account, messafes_by_android_token)

        ack!
    end

    private

    def perform_next_scroll(message_template_id, segment_query = nil, test_customer_ids = [], scroll_id = nil, offset = 0)
        SendMessageWorker.perform_async(message_template_id, segment_query, test_customer_ids, scroll_id, offset)
    end

    def client
        @client ||= Elasticsearch::Model.client
    end

    def send_push_notification_for_ios_messages(account, messages_by_token)
        ios_platform = account.ios_platform
        return if ios_platform.certificate.nil?
        ApnsHelper.send(ios_platform, messages_by_token)
    end

    def send_push_notification_for_android_messages(account, messages_by_token)
        android_platform = account.android_platform
        return if android_platform.api_key.nil?
        GcmHelper.send(android_platform, messages_by_token)
    end

end
