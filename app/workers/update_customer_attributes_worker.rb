class UpdateCustomerAttributesWorker
    include BackgroundWorker::Worker

    from_queue 'update_customer_attributes'

    def self.perform_async(customer_id, new_attributes)
        # do a permit here
        updated_attributes = ActionController::Parameters.new(new_attributes).permit(:identifier, :name, :email, :phone_number, {:tags => []})
        updated_attributes[:traits] = new_attributes.fetch(:traits, {})
        msg = {id: customer_id, attributes: updated_attributes}
        enqueue_message(msg, {to_queue: 'update_customer_attributes'})
    end

    def perform(args)
        customer_id = args["id"]
        attributes = args["attributes"].with_indifferent_access
        customer = Customer.lock.find_by_id(customer_id)
        if customer
            new_attributes = customer.merge_and_update_attributes(attributes)
        end
        ack!
    end
end
