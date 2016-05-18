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
                    traits: customer.traits,
                    :"total-visits" => customer.total_place_visits.to_i,
                    :"last-visit" => customer.last_place_visit_at.nil? ? nil : customer.last_place_visit_at.iso8601(3),
                    :"first-visit" => customer.first_visit_at.nil? ? nil : customer.first_visit_at.iso8601(3)
                }
            }
        end
    end
end
