class CustomerActiveTraits < ActiveRecord::Base

    def self.update_traits(account_id, old_trait_keys, new_traits)
        if !(old_trait_keys.empty? && new_traits.empty?)
            UpdateCustomerActiveTraitsWorker.perform_async(account_id, old_trait_keys, new_traits)
        end
    end
end
