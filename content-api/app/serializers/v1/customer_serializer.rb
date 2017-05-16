module V1::CustomerSerializer
    class << self
        def serialize(customer, extra_attributes = {})
            {
                type: "customers",
                id: customer.id,
                attributes: {
                    identifier: customer.identifier,
                    :"first-name" => customer.first_name,
                    :"last-name" => customer.last_name,
                    email: customer.email,
                    :"phone-number" => customer.phone_number,
                    tags: customer.tags,
                    traits: customer.traits
                }
            }
        end
    end
end
