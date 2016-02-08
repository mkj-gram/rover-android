class UpdateCustomerAttributesWorker
    include BackgroundWorker::Worker

    from_queue 'update_customer_attributes'

    def self.perform_async(customer_id, new_attributes)
        msg = {id: customer_id, attributes: new_attributes}.to_json
        enqueue_message(msg, {to_queue: 'update_customer_attributes'})
    end

    def work(msg)
        payload = JSON.parse(msg)
        customer_id = payload["id"]
        attributes = payload["attributes"].with_indifferent_access
        customer = Customer.lock.find_by_id(customer_id)
        if customer
            new_attributes = customer.local_merge_attributes(attributes)
            customer.update(new_attributes)
        end
        ack!
    end
end
