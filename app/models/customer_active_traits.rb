class CustomerActiveTraits < ActiveRecord::Base

    def self.update_traits(account_id, old_trait_keys, new_trait_keys)
        if !(old_trait_keys.empty? && new_trait_keys.empty?)
            UpdateCustomerActiveTraitsWorker.perform_async(account_id, old_trait_keys, new_trait_keys)
        end
    end
end
