require 'signature_helper'
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

    def local_merge_attributes(new_attributes)
        new_traits = new_attributes.dig(:traits)
        new_tags = new_attributes.dig(:tags)
        {
            id: self.id,
            name: new_attributes.dig(:name) || self.name,
            email: new_attributes.dig(:email) || self.email,
            phone_number: new_attributes.dig(:"phone-number") || self.phone_number,
            tags: new_tags.nil? ? self.tags : (self.tags + new_tags).uniq,
            alias: new_attributes.dig(:alias) || self.alias,
            traits: new_traits.nil? ? self.traits : self.traits.merge(new_traits)
        }
    end

    private

    def needs_update?(new_attributes)
        true
    end

end
