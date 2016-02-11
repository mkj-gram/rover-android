class UpdateCustomerActiveTraitsWorker
    include BackgroundWorker::Worker

    from_queue 'update_customer_active_traits'

    def self.perform_async(account_id, old_trait_keys, new_trait_keys)
        msg = {account_id: account_id, old_trait_keys: old_trait_keys, new_trait_keys: new_trait_keys}.to_json
        enqueue_message(msg, {to_queue: 'update_customer_active_traits'})
    end

    def work(msg)
        payload = JSON.parse(msg)
        account_id = payload["account_id"]
        old_trait_keys = payload["old_trait_keys"]
        new_trait_keys = payload["new_trait_keys"]
        # before removing we need to check if a customer with that trait key exists
        old_trait_keys.each do |trait_key|
            if !Customer.where(account_id: account_id).where("traits ? :trait_key", trait_key: trait_key).exists?
                # don't need to read the model just delete it
                CustomerActiveTraits.where(account_id: account_id).where(trait_key: trait_key).delete_all
            end
        end

        new_trait_keys.each do |trait_key|
            begin
                CustomerActiveTraits.create(account_id: account_id, trait_key: trait_key)
            rescue ActiveRecord::RecordNotUnique => e
                Rails.logger.warn("Customer trait already exists #{trait_key}")
                Rails.logger.warn("Message: #{e.message}")
            end
        end
        ack!
    end
end
