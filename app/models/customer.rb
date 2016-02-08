class Customer < ActiveRecord::Base

    has_many :devices, class_name: "CustomerDevice"

    def attributes_signature
        SignatureHelper.createsig({ id: self.id, alias: self.alias, traits: self.traits })
    end

    def update_attributes_async(new_attributes)
        if needs_update?(new_attributes)
            UpdateCustomerAttributesWorker.perform_async(self.id, new_attributes)
        end
    end

    def merge_and_update_attributes(new_attributes)
        new_traits = new_attributes.delete(:traits)
        new_tags = new_attributes.delete(:tags)

        new_attributes[:traits] = self.traits.merge!(new_traits) if new_traits && new_traits.any?
        new_attributes[:tags] = (self.tags + new_tags).uniq if new_tags && new_tags.any?



        if new_attributes.any?
            self.update_attributes(new_attributes)
        end
    end

    private

    def needs_update?(new_attributes)
        true
    end

end
