module V1::CustomerSegmentSerializer
    class << self
        def serialize(customer_segment)
            {
                "type" => "segments",
                "id" => customer_segment.id.to_s,
                "attributes" => {
                    "name" => customer_segment.title,
                    "filters" => customer_segment.filters.map{|filter| filter.dump},
                    "approximate-customers-count" => customer_segment.customers_count,
                    "total-customers-count" => customer_segment.account.customers_count
                }
            }
        end
    end
end
