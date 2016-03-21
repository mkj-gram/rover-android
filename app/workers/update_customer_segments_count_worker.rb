class UpdateCustomerSegmentsCountWorker
    include BackgroundWorker::Worker

    from_queue 'update_customer_segments_count'
    # ,
    #     :durable => false,
    #     :ack => true,
    #     :threads => 1,
    #     :prefetch => 1,
    #     :timeout_job_after => 600

    def self.preform_async
        msg = {}.to_json
        enqueue_message(msg, {to_queue: 'update_customer_segments_count'})
    end

    def work(msg)
        CustomerSegment.find_each(batch_size: 50) do |customer_segment|
            customer_segment.update_customers_count!
        end
        ack!
    end

end
