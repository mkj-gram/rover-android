module V1::CustomerSegmentSerializer
    class << self
        def serialize(customer_segment)
            {
                "type" => "customer-segments",
                "id" => customer_segment.id.to_s,
                "attributes" => {
                    "name" => customer_segment.title,
                    "filters" => customer_segment.filters,
                    "approximate-customers-count" => customer_segment.approximate_customers_count,
                }
            }
        end
    end
end
