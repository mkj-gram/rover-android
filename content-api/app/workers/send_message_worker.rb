class SendMessageWorker
    # include BackgroundWorker::Worker

    # from_queue 'send_message_to_customers',
    #     :prefetch => 1,
    #     :ack => true


    def self.perform_async(message_template_or_id, base_query = {}, test_customer_ids = [], time_zone_offset = nil)
        message_template = message_template_or_id.is_a?(MessageTemplate) ? message_template_or_id : MessageTemplate.find(message_template_or_id)
        account = message_template.account
        if message_template.customer_segment
            customer_segment = { filters: message_template.customer_segment.filters.map(&:dump) }
        else
            customer_segment = {}
        end

        job_count = message_template.static_segment_id.present? ? 1 : 4
        
        for i in 0..job_count

            job = {
                message_template: message_template,
                static_segment_id: message_template.static_segment_id,
                account: account,
                test_customer_ids: test_customer_ids,
                segment: customer_segment,
                stream_id: i,
                platform_credentials: {
                    fcm: {
                        api_key: account.android_platform.api_key,
                        sender_id: account.android_platform.sender_id,
                        messaging_token: account.android_platform.messaging_token
                    },
                    apns: {
                        certificate: account.ios_platform.certificate ? Base64.encode64(account.ios_platform.certificate) : nil,
                        passphrase: account.ios_platform.passphrase,
                        topic: account.ios_platform.bundle_id
                    }
                }
            }

            if time_zone_offset != nil
                job[:time_zone_offset] = time_zone_offset
            end

            RabbitMQPublisher.publish(job.to_json, {to_queue: 'send_message_to_customers', content_type: 'application/json'})
        end

    end
end
