class ProximityMessage < ActiveRecord::Base
    include FormattableMessage

    message_attribute :message

    def serialize(opts = {})
        customer = opts.delete(:customer)
        if customer
            opts.merge!(customer.attributes.inject({}){|hash, (k,v)| hash.merge("customer_#{k}" => v)})
        end
        device = opts.delete(:device)
        if device
            opts.merge!(device.attributes.inject({}){|hash, (k,v)| hash.merge("device_#{k}" => v)})
        end
        {
            type: "proximity-messages",
            id: self.id.to_s,
            attributes: {
                message: self.formatted_message(opts)
            }
        }
    end
end
