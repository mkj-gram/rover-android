class UpdateCustomerAttributesWorker
    include BackgroundWorker::Worker

    from_queue 'update_customer_attributes'

    def self.perform_async(customer_id, new_attributes)
        # do a permit here
        updated_attributes = ActionController::Parameters.new(new_attributes).permit(:alias, :name, :email, :phone_number, {:tags => []})
        updated_attributes[:traits] = new_attributes.fetch(:traits, {})
        msg = {id: customer_id, attributes: updated_attributes}.to_json
        enqueue_message(msg, {to_queue: 'update_customer_attributes'})
    end

    def work(msg)
        payload = JSON.parse(msg)
        customer_id = payload["id"]
        attributes = payload["attributes"].with_indifferent_access
        customer = Customer.lock.find_by_id(customer_id)
        if customer
            new_attributes = customer.merge_and_update_attributes(attributes)
        end
        ack!
    end
end
